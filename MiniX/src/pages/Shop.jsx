// src/pages/Shop.jsx
import useSEO from "../hooks/useSEO";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import { ChevronDown, Search } from "lucide-react";
import ScrollReveal from "../Components/ScrollReveal";
import axios from "axios";

import ShopSkeleton from "../Components/skeletons/ShopSkeleton";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import Collections from "../Components/Collections";
import ProductCard from "../Components/ProductCard";
import API_BASE_URL from "../config";

export default function Shop() {
  useSEO({
    title: "Shop All Products",
    description:
      "Browse MiniX's full range of premium streetwear. Filter by category, search, and sort by price to find your perfect style.",
    url: "/shop",
  });

  const [searchParams] = useSearchParams();

  /* ---------------- Products from Backend ---------------- */
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/product/all`);
        setProductData(data.products || []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  /* ---------------- URL → STATE ---------------- */
  const categoryFromURL = searchParams.get("category") || "All";
  const searchFromURL = searchParams.get("search") || "";

  const [activeCategory, setActiveCategory] = useState(categoryFromURL);
  const [searchQuery, setSearchQuery] = useState(searchFromURL);
  const [sortType, setSortType] = useState("relevance");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [priceRange] = useState([0, 100]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setActiveCategory(categoryFromURL);
    setSearchQuery(searchFromURL);
    setPage(1);
  }, [categoryFromURL, searchFromURL]);

  /* ---------------- STATE → URL ---------------- */
  const updateURL = (updates) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === "All") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    window.history.replaceState({}, "", `/shop?${params.toString()}`);
  };

  /* ---------------- Categories ---------------- */
  const categories = [
    "All",
    ...new Set(productData.map((p) => p.category?.slug || "uncategorized")),
  ];

  /* ---------------- Filtering ---------------- */
  const filteredProducts = productData.filter((p) => {
    const productCategory = p.category?.slug || "uncategorized";
    const matchesCategory =
      activeCategory === "All" || productCategory === activeCategory;
    const matchesSearch = p.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesPrice =
      p.price >= priceRange[0] && p.price <= priceRange[1];

    return matchesCategory && matchesSearch && matchesPrice;
  });

  /* ---------------- Sorting ---------------- */
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortType) {
      case "lowToHigh":
        return a.price - b.price;
      case "highToLow":
        return b.price - a.price;
      default:
        return a.id - b.id;
    }
  });

  /* ---------------- Pagination ---------------- */
  const perPage = 8;
  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / perPage));
  const pageProducts = sortedProducts.slice(
    (page - 1) * perPage,
    page * perPage
  );

  /* ---------------- UI ---------------- */
  return (
    <div className="bg-black text-white min-h-screen pt-28">
      <Navbar />

      {/* BANNER */}
      <div className="w-full bg-gradient-to-r from-[#0b0b0b]/80 to-[#f6f5f3]/10 py-6">
        <div className="max-w-[1250px] mx-auto px-6">
          <div className="rounded-xl overflow-hidden bg-[url('https://images.unsplash.com/photo-1541099649105-f69ad21f3246')] bg-cover bg-center h-44 md:h-56 shadow-lg flex items-center px-6">
            <div className="text-white/95">
              <h2 className="text-3xl md:text-4xl font-bold">Shop</h2>
              <p className="text-gray-300 mt-2">
                Discover our latest drops and timeless essentials
              </p>
            </div>
          </div>
        </div>
      </div>

      <Collections />

      {/* FILTERS */}
      <div className="max-w-[1250px] mx-auto px-6 mt-8 mb-12">
        <div className="flex flex-col gap-6">
          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-3 bg-[rgba(255,255,255,0.03)] border border-white/10 px-4 py-3 rounded-2xl"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  updateURL({ category: cat });
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-xl text-sm ${activeCategory === cat
                  ? "bg-white text-black"
                  : "text-gray-300 hover:bg-white/10"
                  }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>

          {/* Search + Sort */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-full sm:max-w-[320px]">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchQuery(value);
                  updateURL({ search: value });
                  setPage(1);
                }}
                className="w-full bg-black border border-white/10 rounded-lg pl-10 pr-3 py-2 text-sm"
              />
            </div>

            {/* Sort */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen((s) => !s)}
                className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-sm w-full sm:w-auto justify-between sm:justify-start"
              >
                Sort
                <ChevronDown size={16} />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute right-0 mt-2 w-44 bg-black border border-white/10 rounded-xl z-10"
                  >
                    {[
                      { key: "relevance", label: "Relevance" },
                      { key: "lowToHigh", label: "Low to High" },
                      { key: "highToLow", label: "High to Low" },
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        onClick={() => {
                          setSortType(opt.key);
                          setDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-white/10"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* PRODUCT GRID */}
      <section className="max-w-[1250px] mx-auto px-6 pb-24">
        {loading ? (
          <ShopSkeleton />
        ) : sortedProducts.length === 0 ? (
          <div className="text-center text-gray-400 py-14">
            No products found.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {pageProducts.map((product) => (
                <ProductCard key={product._id || product.slug} product={product} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-3 mt-12">
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setPage(idx + 1)}
                  className={`px-3 py-1 rounded-full ${page === idx + 1
                    ? "bg-white text-black"
                    : "bg-white/10"
                    }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </>
        )}
      </section>

      <Footer />
    </div>
  );
}
