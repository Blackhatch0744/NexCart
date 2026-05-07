// src/Components/PageTransition.jsx
import React from "react";
import { motion } from "framer-motion";

export default function PageTransition({ children }) {
  return (
    <motion.div
      className="min-h-screen"
      initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -20, filter: "blur(6px)" }}
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1], // smooth "easeOutExpo" feel
      }}
    >
      {children}
    </motion.div>
  );
}
