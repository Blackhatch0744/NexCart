import React from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import {
  User,
  Mail,
  Heart,
  ShoppingBag,
  MapPin,
  CreditCard,
  LogOut,
  Package,
  ArrowLeft,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../Components/Navbar";

export default function ProfilePage() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050509] text-white px-4 pt-28 pb-10 relative">
      <Navbar />

      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-20 w-72 h-72 bg-purple-500/30 blur-[90px]" />
        <div className="absolute -bottom-40 -left-10 w-72 h-72 bg-sky-500/30 blur-[90px]" />
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="
          relative z-10 max-w-xl mx-auto 
          bg-white/5 backdrop-blur-2xl
          border border-white/10 
          rounded-3xl p-8
          shadow-[0_0_60px_rgba(0,0,0,0.6)]
        "
      >
        {/* Header */}
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-white mb-4 transition">
            <ArrowLeft size={16} /> Back to Home
          </Link>

          <h1 className="text-2xl font-semibold">My Profile</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Manage your MiniX account settings and preferences.
          </p>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
            <User size={32} className="text-white/80" />
          </div>
          <div>
            <p className="text-lg font-semibold">{user?.name}</p>
            <p className="text-sm text-zinc-400">{user?.email}</p>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-1 gap-3 mb-8">
          {[
            { icon: Package, label: "Orders", route: "/orders" },
            { icon: Heart, label: "Wishlist", route: "/wishlist" },
            { icon: MapPin, label: "Addresses", route: "/addresses" },
            { icon: CreditCard, label: "Saved Payments", route: "/payments" },
          ].map((item, index) => (
            <motion.div
              key={index}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(item.route)}
              className="
                flex items-center justify-between
                bg-black/40 border border-white/10 
                rounded-xl px-4 py-3 cursor-pointer
                hover:bg-white/10 transition
              "
            >
              <div className="flex items-center gap-3">
                <item.icon size={18} />
                <span>{item.label}</span>
              </div>
              <span className="text-white/40 text-xs">View</span>
            </motion.div>
          ))}
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate("/edit-profile")}
            className="
              w-full py-2.5 rounded-xl bg-white text-black 
              font-medium text-sm shadow-[0_0_30px_rgba(255,255,255,0.15)]
            "
          >
            Edit Profile
          </button>

          <button
            onClick={logoutUser}
            className="
              w-full py-2.5 rounded-xl bg-red-500/20 text-red-400
              border border-red-500/30 text-sm
              hover:bg-red-500/30 transition
              flex items-center justify-center gap-2
            "
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </motion.div>
    </div>
  );
}
