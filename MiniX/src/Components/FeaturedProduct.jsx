import React from "react";
import { Link } from "react-router-dom";
import productData from "../data/productData";
import ProductCard from "../Components/ProductCard";

export default function FeaturedProduct() {
  const featured = productData.slice(0, 4);

  return (
    <section className="w-full bg-black text-white py-20 px-6 lg:px-20">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-3xl md:text-4xl font-bold">
          Featured Products
        </h2>

        <Link
          to="/shop"
          className="text-gray-300 hover:text-white transition text-sm"
        >
          View all products →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {featured.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
