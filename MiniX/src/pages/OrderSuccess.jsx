// src/pages/OrderSuccess.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import Confetti from "react-confetti";
import { CheckCircle } from "lucide-react";

export default function OrderSuccess() {
  const [order, setOrder] = useState(null);
  const [showConfetti, setShowConfetti] = useState(true);
  const [windowDimension, setWindowDimension] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const navigate = useNavigate();

  const detectSize = () => {
    setWindowDimension({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  useEffect(() => {
    window.addEventListener("resize", detectSize);
    return () => window.removeEventListener("resize", detectSize);
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("minix-last-order");
      if (raw) setOrder(JSON.parse(raw));
    } catch { }

    // Stop confetti after 5 seconds
    const timer = setTimeout(() => setShowConfetti(false), 5000);

    // Premium UI Success Chime using Web Audio API (so no assets needed)
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        const ctx = new AudioContext();
        const playTone = (freq, startTime, duration) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);
          gain.gain.setValueAtTime(0, ctx.currentTime + startTime);
          gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + startTime + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + duration);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + startTime);
          osc.stop(ctx.currentTime + startTime + duration);
        };
        // A magical, premium sounding major chord arpeggio
        playTone(523.25, 0, 0.4); // C5
        playTone(659.25, 0.1, 0.4); // E5
        playTone(783.99, 0.2, 0.6); // G5
        playTone(1046.50, 0.3, 1.0); // C6
      }
    } catch (err) {
      console.log("Audio skipped due to browser policy constraints.");
    }

    return () => clearTimeout(timer);
  }, []);

  if (!order) {
    return (
      <div className="bg-black text-white min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6">
          <h2 className="text-2xl">No recent order found</h2>
          <Link
            to="/shop"
            className="px-6 py-3 bg-white text-black rounded-lg font-semibold"
          >
            Continue Shopping
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen overflow-hidden relative">
      {/* Confetti Explosion Layer */}
      {showConfetti && (
        <Confetti
          width={windowDimension.width}
          height={windowDimension.height}
          colors={['#fff', '#ccc', '#999', '#555', '#222']}
          recycle={false}
          numberOfPieces={400}
          gravity={0.15}
          style={{ position: 'absolute', top: 0, left: 0, zIndex: 100, pointerEvents: 'none' }}
        />
      )}

      <Navbar />

      <section className="px-6 lg:px-20 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-3xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-10 backdrop-blur-md text-center shadow-2xl relative overflow-hidden"
        >
          {/* Subtle glow behind card */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-white/5 blur-3xl rounded-full" />

          {/* Animated Checkmark Sequence */}
          <motion.div 
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 12, stiffness: 100, delay: 0.2 }}
            className="flex justify-center mb-6 relative z-10"
          >
            <CheckCircle className="text-white w-20 h-20" strokeWidth={1.5} />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-4xl font-bold mb-3 tracking-tight relative z-10"
          >
            Order Placed Successfully!
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-gray-400 mb-8 relative z-10"
          >
            Thank you for shopping with MiniX. We've received your order and are getting it ready.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 }}
            className="bg-black/40 border border-white/10 rounded-xl p-6 text-left mb-8 relative z-10 block sm:flex justify-between items-center"
          >
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Order Number</p>
              <p className="font-mono text-lg font-semibold">{order._id}</p>
            </div>
            <div className="mt-4 sm:mt-0 text-left sm:text-right">
              <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Order Date</p>
              <p className="font-semibold">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
          </motion.div>

          {/* Details Grid */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="grid sm:grid-cols-2 gap-6 text-left mb-10 relative z-10"
          >
            <div className="bg-white/5 p-5 rounded-xl border border-white/5">
              <p className="text-sm text-gray-400 mb-1">Fulfillment</p>
              <p className="capitalize font-medium">{order.orderStatus}</p>
            </div>

            <div className="bg-white/5 p-5 rounded-xl border border-white/5">
              <p className="text-sm text-gray-400 mb-1">Payment</p>
              <p className="capitalize font-medium">{order.paymentMethod} - {order.paymentStatus}</p>
              <p className="text-lg mt-2 font-bold">${order.totalAmount.toFixed(2)}</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center relative z-10"
          >
            <Link
              to="/orders"
              className="px-8 py-3.5 bg-white text-black rounded-lg font-bold shadow-lg hover:shadow-white/20 transition-all duration-300 transform hover:-translate-y-1"
            >
              Track Order
            </Link>
            <button
              onClick={() => navigate("/")}
              className="px-8 py-3.5 bg-transparent border border-white/20 text-white rounded-lg font-semibold hover:bg-white/5 transition-colors"
            >
              Return Home
            </button>
          </motion.div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
