import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import useSEO from "../hooks/useSEO";

export default function NotFound() {
  useSEO({
    title: "Page Not Found",
    description: "The page you're looking for doesn't exist. Browse our premium streetwear collections instead.",
    url: "/404",
  });

  return (
    <section className="min-h-screen bg-black flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center max-w-lg"
      >
        {/* Large 404 */}
        <motion.h1
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-[8rem] sm:text-[10rem] font-extrabold leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10"
        >
          404
        </motion.h1>

        <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2 mb-4">
          Page Not Found
        </h2>

        <p className="text-gray-400 text-base sm:text-lg mb-10 leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
          Let's get you back to something awesome.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="bg-white text-black font-semibold px-8 py-3.5 rounded-xl hover:scale-[1.04] transition-transform duration-300 shadow-lg"
          >
            ← Back to Home
          </Link>

          <Link
            to="/shop"
            className="border border-white/20 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-colors duration-300"
          >
            Browse Shop
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="mt-14 pt-8 border-t border-white/10">
          <p className="text-sm text-gray-500 mb-4">Or try these popular pages:</p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <Link to="/shop" className="text-gray-400 hover:text-white transition-colors">
              Shop All
            </Link>
            <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
              About Us
            </Link>
            <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
