import React, { useState, useEffect } from "react";
import axios from "axios";
import { X, Save, Image as ImageIcon } from "lucide-react";
import API_BASE_URL from "../../config";

export default function AdminProductForm({
    product,
    onClose,
    onSave,
    fetchProducts,
}) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        images: "",
        isFeatured: false,
    });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCategories();
        if (product) {
            setFormData({
                name: product.name,
                description: product.description,
                price: product.price,
                stock: product.stock,
                category: product.category?._id || "",
                images: product.images ? product.images.join(",") : "", // Handle array
                isFeatured: product.isFeatured || false,
            });
        }
    }, [product]);

    const fetchCategories = async () => {
        try {
            const { data } = await axios.get(`${API_BASE_URL}/api/category/all`);
            setCategories(data.categories || []);
        } catch (error) {
            console.error("Failed to fetch categories");
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...formData,
                images: formData.images.split(",").map((url) => url.trim()), // Split by comma
            };

            if (product) {
                // Update
                await axios.put(
                    `${API_BASE_URL}/api/product/${product._id}`,
                    payload,
                    { withCredentials: true }
                );
            } else {
                // Create
                await axios.post(`${API_BASE_URL}/api/product/create`, payload, {
                    withCredentials: true,
                });
            }

            fetchProducts();
            onSave(); // Close modal
        } catch (error) {
            console.error("Failed to save product", error);
            alert(error.response?.data?.message || "Failed to save product");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#111] border border-white/10 w-full max-w-2xl rounded-3xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <h2 className="text-xl font-semibold">
                        {product ? "Edit Product" : "Add New Product"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Scrollable Form */}
                <div className="flex-1 overflow-y-auto p-6">
                    <form id="product-form" onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm text-white/60">Product Name</label>
                                <input
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="input w-full"
                                    placeholder="e.g. Oversized T-Shirt"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-white/60">Category</label>
                                <select
                                    name="category"
                                    required
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="input w-full"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((cat) => (
                                        <option key={cat._id} value={cat._id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm text-white/60">Price (₹)</label>
                                <input
                                    name="price"
                                    type="number"
                                    required
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="input w-full"
                                    placeholder="999"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-white/60">Stock</label>
                                <input
                                    name="stock"
                                    type="number"
                                    required
                                    value={formData.stock}
                                    onChange={handleChange}
                                    className="input w-full"
                                    placeholder="100"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-white/60">Description</label>
                            <textarea
                                name="description"
                                rows="3"
                                value={formData.description}
                                onChange={handleChange}
                                className="input w-full resize-none"
                                placeholder="Product description..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-white/60">
                                Images (Comma separated URLs)
                            </label>
                            <div className="relative">
                                <ImageIcon
                                    size={18}
                                    className="absolute left-4 top-3.5 text-white/40"
                                />
                                <input
                                    name="images"
                                    required
                                    value={formData.images}
                                    onChange={handleChange}
                                    className="input w-full pl-10"
                                    placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
                                />
                            </div>
                            <p className="text-xs text-white/40">
                                Tip: Copy image addresses from Unsplash or other sources.
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="isFeatured"
                                id="isFeatured"
                                checked={formData.isFeatured}
                                onChange={handleChange}
                                className="accent-white w-4 h-4"
                            />
                            <label htmlFor="isFeatured" className="text-sm select-none cursor-pointer">
                                Mark as Featured Product
                            </label>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 flex justify-end gap-3 bg-[#111]">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="product-form"
                        disabled={loading}
                        className="px-6 py-2.5 rounded-xl bg-white text-black font-medium hover:bg-gray-200 transition flex items-center gap-2"
                    >
                        {loading ? "Saving..." : <><Save size={18} /> Save Product</>}
                    </button>
                </div>
            </div>
        </div>
    );
}
