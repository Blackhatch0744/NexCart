import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "./Components/ScrollReveal";
import useSEO from "./hooks/useSEO";

import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Hero from "./Components/Hero";
import Collections from "./Components/Collections";
import FeaturedProduct from "./Components/FeaturedProduct";



function App() {
  useSEO({
    title: "Premium Streetwear & Fashion | Shop Hoodies, Tees & Accessories",
    description:
      "Shop MiniX for premium streetwear hoodies, graphic tees, cargo pants & accessories. Minimalist fashion with fast shipping & secure checkout. Explore new drops now.",
    url: "/",
  });

  return (
    <div className="min-h-screen bg-black text-white font-inter overflow-x-hidden">

      <Navbar />

      {/* NEW HERO */}
      <Hero />

      <ScrollReveal>
        <FeaturedProduct />
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        <Collections />
      </ScrollReveal>
      <Footer />

      {/* 🔔 Toast */}
      {/* 🔔 Toast moved to GlobalToast in main.jsx */}
    </div>
  );
}

export default App;
