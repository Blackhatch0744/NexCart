import React from "react";
import useSEO from "../hooks/useSEO";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { motion } from "framer-motion";

export default function About() {
  useSEO({
    title: "About Us",
    description:
      "MiniX is a minimalist streetwear brand crafted with precision, premium materials, and timeless design. We are a community of creators redefining modern fashion.",
    url: "/about",
  });
  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      <Navbar />

      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex-1 flex flex-col items-center justify-center px-8 lg:px-20 text-center"
      >
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          About Minix
        </h1>
        <p className="text-gray-400 max-w-2xl leading-relaxed">
          At <span className="text-white font-semibold">Minix</span>, we believe
          in minimalism, quality, and comfort. Our streetwear line is crafted
          with precision — combining premium materials with timeless design.
          <br />
          <br />
          We’re a community of creators, dreamers, and doers redefining fashion
          for the modern world.
        </p>
      </motion.section>

      <Footer />
    </div>
  );
}
