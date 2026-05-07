import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Edit2, Trash2, Search } from "lucide-react";
import AdminProductForm from "./AdminProductForm";
import API_BASE_URL from "../../config";

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data } = await axios.get(
                `${API_BASE_URL}/api/product/admin/all`,
                { withCredentials: true }
            );
            setProducts(data.products || []);
        } catch (error) {
            console.error("Failed to fetch products");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await axios.delete(`${API_BASE_URL}/api/product/${id}`, {
                withCredentials: true,
            });
            setProducts(products.filter((p) => p._id !== id));
        } catch (error) {
            console.error("Failed to delete product");
            alert("Failed to delete product");
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setShowForm(true);
    };

    const handleAddNew = () => {
        setEditingProduct(null);
        setShowForm(true);
    };

    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <h2 className="text-3xl font-semibold">Products</h2>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 text-white/40" size={18} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/30 text-sm w-64"
                        />
                    </div>
                    <button
                        onClick={handleAddNew}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-xl font-medium hover:bg-gray-200 transition"
                    >
                        <Plus size={18} /> Add Product
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="text-white/60">Loading products...</div>
            ) : (
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-white/60 text-sm uppercase">
                            <tr>
                                <th className="px-6 py-4 font-medium">Product</th>
                                <th className="px-6 py-4 font-medium">Category</th>
                                <th className="px-6 py-4 font-medium">Price</th>
                                <th className="px-6 py-4 font-medium">Stock</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10 text-sm">
                            {filteredProducts.map((product) => (
                                <tr key={product._id} className="hover:bg-white/5 transition">
                                    <td className="px-6 py-4 flex items-center gap-3">
                                        <img
                                            src={product.images[0]}
                                            alt={product.name}
                                            className="w-10 h-10 rounded-lg object-cover bg-white/10"
                                        />
                                        <span className="font-medium">{product.name}</span>
                                    </td>
                                    <td className="px-6 py-4 text-white/70">
                                        {product.category?.name || "Uncategorized"}
                                    </td>
                                    <td className="px-6 py-4">₹{product.price}</td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`${product.stock < 10 ? "text-red-400" : "text-green-400"
                                                }`}
                                        >
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button
                                            onClick={() => handleEdit(product)}
                                            className="p-2 hover:bg-white/10 rounded-lg transition text-blue-400"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product._id)}
                                            className="p-2 hover:bg-white/10 rounded-lg transition text-red-400"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredProducts.length === 0 && (
                        <div className="p-8 text-center text-white/40">
                            No products found.
                        </div>
                    )}
                </div>
            )}

            {showForm && (
                <AdminProductForm
                    product={editingProduct}
                    onClose={() => setShowForm(false)}
                    onSave={() => setShowForm(false)}
                    fetchProducts={fetchProducts}
                />
            )}
        </div>
    );
}
