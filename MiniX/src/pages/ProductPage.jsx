// src/pages/ProductPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import useSEO from "../hooks/useSEO";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Star,
  ShoppingBag,
  Heart,
  Minus,
  Plus,
} from "lucide-react";

import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import ProductSkeleton from "../Components/skeletons/ProductSkeleton";

import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import axios from "axios";
import API_BASE_URL from "../config";

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  /* ---------------- Product lookup ---------------- */
  const [dbProduct, setDbProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/product/${id}`);
        setDbProduct(data.product);
      } catch (err) {
        console.error("Failed to load product", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const product = useMemo(() => {
    if (!dbProduct) return null;
    return {
      ...dbProduct,
      category: dbProduct.category?.name || "Product",
      rating: 4.8,
      reviewCount: 15,
      variants: {
        sizes: ["S", "M", "L", "XL"],
        colors: [
          { name: "Black", hex: "#111111" },
          { name: "White", hex: "#eaeaea" },
        ],
      },
      details: {
        material: "Premium Material",
        fit: "Standard Fit",
      }
    };
  }, [dbProduct]);

  /* ---------------- Safe defaults (HOOK SAFE) ---------------- */
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showToast, setShowToast] = useState(false);

  /* ---------------- Sync when product loads ---------------- */
  useEffect(() => {
    if (!product) return;

    setSelectedSize(product.variants.sizes[0]);
    setSelectedColor(product.variants.colors[0]);
    setSelectedImage(0);
    setQuantity(1);
  }, [product]);

  /* ---------------- Dynamic SEO ---------------- */
  useSEO(
    product
      ? {
          title: product.name,
          description:
            product.description ||
            `Shop ${product.name} at MiniX. Premium streetwear — fast shipping & secure checkout.`,
          image: product.images?.[0] || undefined,
          url: `/product/${id}`,
        }
      : { title: "Product", description: "Shop premium fashion at MiniX.", url: `/product/${id}` }
  );

  /* Product JSON-LD */
  useEffect(() => {
    if (!product) return;
    const scriptId = "product-jsonld";
    let script = document.getElementById(scriptId);
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description: product.description || "",
      image: product.images || [],
      sku: product._id || id,
      brand: { "@type": "Brand", name: "MiniX" },
      offers: {
        "@type": "Offer",
        priceCurrency: "USD",
        price: product.price,
        availability: "https://schema.org/InStock",
        url: `https://minix.vercel.app/product/${id}`,
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.rating || 4.8,
        reviewCount: product.reviewCount || 15,
      },
    });
    return () => {
      const el = document.getElementById(scriptId);
      if (el) el.remove();
    };
  }, [product, id]);

  /* ---------------- Guards ---------------- */
  if (loading) {
    return (
      <>
        <Navbar />
        <ProductSkeleton />
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-32 text-center text-zinc-400">
          Product not found
        </div>
        <Footer />
      </>
    );
  }

  /* ---------------- Actions ---------------- */
  const handleAddToCart = () => {
    addToCart({
      ...product,
      selectedSize,
      selectedColor,
      quantity,
    });

    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/checkout");
  };

  const isInWishlist = isWishlisted(product.id);

  /* ---------------- UI ---------------- */
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#050509] text-white pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4">

          {/* Back */}
          <div className="mb-6 flex items-center gap-2 text-sm text-zinc-400">
            <ArrowLeft size={18} />
            <Link to="/shop" className="hover:text-white">
              Back to Shop
            </Link>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">

            {/* Images */}
            <div>
              <div className="rounded-3xl overflow-hidden border border-white/10 bg-zinc-900">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-[420px] object-cover"
                />
              </div>

              <div className="flex gap-3 mt-4">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`h-20 w-20 rounded-xl overflow-hidden border ${selectedImage === i
                      ? "border-white"
                      : "border-white/10"
                      }`}
                  >
                    <img src={img} loading="lazy" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="space-y-6">
              <div>
                <p className="uppercase text-xs tracking-widest text-zinc-400">
                  {product.category}
                </p>
                <h1 className="text-3xl font-semibold">{product.name}</h1>

                <div className="flex items-center gap-4 mt-3">
                  <span className="text-2xl font-semibold">
                    ${product.price}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-zinc-400">
                    <Star size={16} className="text-amber-400 fill-amber-400" />
                    {product.rating} ({product.reviewCount})
                  </span>
                </div>
              </div>

              <p className="text-zinc-300 text-sm">{product.description}</p>

              {/* Size */}
              <div>
                <p className="text-xs uppercase tracking-widest text-zinc-400 mb-2">
                  Size
                </p>
                <div className="flex gap-2">
                  {product.variants.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-full border text-sm transition ${selectedSize === size
                        ? "bg-white text-black"
                        : "border-white/10 hover:border-white/40"
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div>
                <p className="text-xs uppercase tracking-widest text-zinc-400 mb-2">
                  Color
                </p>
                <div className="flex gap-3">
                  {product.variants.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      className={`w-7 h-7 rounded-full border-2 transition ${selectedColor?.name === color.name
                        ? "border-white scale-110"
                        : "border-transparent"
                        }`}
                      style={{ backgroundColor: color.hex }}
                    />
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4 mt-2 mb-2">
                <button 
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition"
                >
                  <Minus size={16} />
                </button>
                <span className="w-6 text-center font-medium">{quantity}</span>
                <button 
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition"
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 rounded-full bg-white text-black py-3 font-medium"
                >
                  <ShoppingBag size={18} className="inline mr-2" />
                  Add to Cart
                </button>

                <button
                  onClick={handleBuyNow}
                  className="flex-1 rounded-full border border-white/20 py-3"
                >
                  Buy Now
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  className="rounded-full border border-white/20 p-3"
                >
                  <Heart
                    className={`${isInWishlist
                      ? "fill-pink-500 text-pink-500"
                      : "text-pink-400"
                      }`}
                  />
                </button>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4 text-xs text-zinc-400 pt-4 border-t border-white/10">
                <div>
                  <p className="text-zinc-500">Material</p>
                  <p>{product.details.material}</p>
                </div>
                <div>
                  <p className="text-zinc-500">Fit</p>
                  <p>{product.details.fit}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Toast */}
          <AnimatePresence>
            {showToast && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed bottom-24 right-6 bg-white text-black px-4 py-2 rounded-full shadow-xl text-xs z-50"
              >
                Added to cart
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </>
  );
}
