import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Handle both MongoDB standard `_id` and static `id`
  const productId = product.slug || product._id || product.id;
  const imageSrc = product.images?.[0] || product.image;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="group flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-300 backdrop-blur-md"
    >
      {/* IMAGE CONTAINER */}
      <div 
        onClick={() => navigate(`/product/${productId}`)}
        className="relative overflow-hidden cursor-pointer aspect-[4/5] w-full"
      >
        <img
          src={imageSrc}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        
        {/* Wishlist Button Placeholder */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            /* Add wishlist toggle logic later if needed */
          }}
          className="absolute top-4 right-4 bg-black/40 backdrop-blur-md p-2.5 rounded-full opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-black/70 hover:scale-110 transition-all duration-300"
        >
          <Heart size={18} className="text-white" />
        </button>
      </div>

      {/* INFO */}
      <div className="p-5 flex flex-col flex-grow text-center">
        <Link 
          to={`/product/${productId}`}
          className="text-lg font-semibold text-white/90 hover:text-white transition-colors mb-2 line-clamp-1"
        >
          {product.name}
        </Link>
        
        <p className="text-gray-400 font-medium mb-4">
          ${product.price}
        </p>

        <div className="mt-auto">
          <button
            onClick={() => addToCart(product)}
            className="w-full py-2.5 bg-white/10 text-white font-medium rounded-xl border border-white/20 hover:bg-white hover:text-black hover:border-white transition-all duration-300 active:scale-95"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
}
