import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Hero() {
  const navigate = useNavigate();

  const scrollToFeatured = () => {
    const el = document.querySelector("#featured");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    // Reverted background to gradient as requested
    <section className="w-full bg-gradient-to-r from-[#050505] to-[#f6f5f3] py-20 relative overflow-hidden">
      {/* Decorative gradient blob - keep or remove based on "as it was earlier". Keeping it as a nice touch unless it conflicts. */}
      {/* <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 blur-[120px] rounded-full pointer-events-none" /> */}
      <div className="max-w-[1250px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* LEFT */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-white z-10"
        >
          <p className="uppercase tracking-[0.2em] text-xs font-semibold text-white/60 mb-4">
            The Best Hoodies Are Only Here
          </p>

          <h1 className="font-extrabold leading-[1.1] text-5xl sm:text-6xl lg:text-7xl mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400">
            Minimalist <br /> Streetwear <br /> Built for Everyone
          </h1>

          <p className="text-white/70 max-w-lg mb-8 text-lg font-light">
            Discover refined essentials inspired by underground culture.
            Crafted with premium materials & a focus on absolute simplicity.
          </p>

          {/* CTA BUTTONS */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={scrollToFeatured}
              className="bg-white text-black font-semibold px-6 py-3 rounded-xl shadow-lg hover:scale-[1.04] transition"
            >
              Explore Collections
            </button>

            <button
              onClick={() => navigate("/shop")}
              className="border border-white/20 text-white px-5 py-3 rounded-xl font-semibold hover:bg-white/10 transition"
            >
              Shop Now
            </button>
          </div>

          {/* TAG FILTERS */}
          <div className="flex flex-wrap gap-2 text-sm">
            {["Hoodies", "Tees", "Bottoms", "Accessories"].map((tag, i) => (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.4 + (i * 0.1) }}
                key={tag}
                onClick={() => navigate(`/shop?category=${tag}`)}
                className="px-4 py-1.5 border border-white/20 bg-white/5 backdrop-blur-md text-white/80 rounded-full hover:bg-white/20 transition-all duration-300"
              >
                {tag}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* RIGHT */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="relative flex justify-center lg:justify-end"
        >
          <div className="relative rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden w-full max-w-[480px] transition-transform duration-700 hover:scale-[1.03] border border-white/10 group">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
            <img
              src="/Hero.jpg"
              alt="MiniX premium streetwear hoodie collection - minimalist fashion"
              width={480}
              height={480}
              loading="eager"
              fetchPriority="high"
              className="w-full h-[480px] object-cover"
            />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="hidden lg:block absolute bottom-8 right-8 bg-black/40 p-5 rounded-2xl border border-white/20 shadow-2xl text-right backdrop-blur-xl z-20 hover:bg-black/60 transition-colors"
          >
            <h4 className="font-extrabold text-white text-md tracking-wide">
              New Drop
            </h4>
            <p className="text-gray-300 text-xs mb-3 font-medium">
              Premium streetwear — limited run
            </p>
            <button
              onClick={() => navigate("/shop")}
              className="font-bold text-white text-sm hover:text-gray-300 transition-colors flex items-center justify-end gap-1 w-full"
            >
              Discover Now <span>→</span>
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
