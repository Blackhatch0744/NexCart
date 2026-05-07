// src/pages/AuthPage.jsx
import React, { useState, useEffect } from "react";
import useSEO from "../hooks/useSEO";
// Removed react-oauth/google import
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import Loader from "../Components/Loader";
import AuthButton from "../Components/AuthButton";
import { toast } from "react-toastify";

import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";

const cardVariants = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -10, scale: 0.98 },
};

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");

  useSEO({
    title: activeTab === "login" ? "Sign In" : "Create Account",
    description:
      "Log in or create your MiniX account to shop, track orders, manage your wishlist, and access exclusive deals.",
    url: "/auth",
  });
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { user, loading, registerUser, loginUser, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      navigate(location.state?.from || "/", { replace: true });
    }
  }, [user, loading, location.state, navigate]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const { name, email, password } = form;

    if (!email || !password || (activeTab === "register" && !name)) {
      setErrorMsg("Please fill all required fields.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password should be at least 6 characters.");
      return;
    }

    try {
      setSubmitting(true);
      if (activeTab === "register") {
        await registerUser(name.trim(), email.trim(), password);
      } else {
        await loginUser(email.trim(), password);
      }
    } catch {
      setErrorMsg(
        activeTab === "login"
          ? "Login failed. Please check your credentials."
          : "Registration failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSuccess = async () => {
    try {
      setSubmitting(true);
      setErrorMsg("");
      const userData = await loginWithGoogle();
      localStorage.setItem(
        "user", 
        JSON.stringify({ 
          uid: userData.uid, 
          name: userData.displayName || "User", 
          email: userData.email 
        })
      );
      toast.success("Successfully logged in with Google!");
      navigate(location.state?.from || "/", { replace: true });
    } catch (err) {
      console.error("[Google Auth Error]:", err);
      // Give more specific error details to the user
      setErrorMsg(err.message || "Google authentication failed. Please try again.");
      toast.error(err.message || "Google authentication failed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050509] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader />
          <p className="text-sm text-white/70">Checking your session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050509] text-white flex items-center justify-center">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-purple-500/20 blur-[120px]" />
        <div className="absolute -bottom-40 -left-24 w-96 h-96 bg-sky-500/20 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 px-4 py-10">

        {/* LEFT: AUTH CARD */}
        <motion.div
          variants={cardVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="w-full max-w-md mx-auto rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_0_60px_rgba(0,0,0,0.7)] p-6 md:p-7"
        >
          {/* Back */}
          <Link
            to="/"
            className="text-xs text-zinc-400 hover:text-white transition mb-4 inline-block"
          >
            ← Back to Home
          </Link>

          {/* Branding */}
          <div className="mb-5">
            <p className="text-xs uppercase tracking-[0.24em] text-zinc-400">
              Welcome to
            </p>
            <h1 className="text-2xl font-semibold">MiniX</h1>
          </div>

          {/* Tabs */}
          <div className="flex mb-5 rounded-full bg-black/40 p-1 border border-white/10">
            {["login", "register"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 text-sm rounded-full transition ${activeTab === tab
                  ? "bg-white text-black font-medium"
                  : "text-zinc-400 hover:text-zinc-100"
                  }`}
              >
                {tab === "login" ? "Log in" : "Sign up"}
              </button>
            ))}
          </div>

          <p className="text-xs text-zinc-400 mb-4">
            {activeTab === "login"
              ? "Access your MiniX account."
              : "Create an account to save your cart, wishlist & orders."}
          </p>

          {errorMsg && (
            <div className="mb-4 rounded-2xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
              {errorMsg}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <AnimatePresence mode="wait">
              {activeTab === "register" && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="space-y-1"
                >
                  <label className="text-xs text-zinc-400">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full rounded-xl bg-black/40 border border-white/15 px-3 py-2.5 text-sm outline-none focus:border-white/60"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1">
              <label className="text-xs text-zinc-400">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-xl bg-black/40 border border-white/15 px-3 py-2.5 text-sm outline-none focus:border-white/60"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-zinc-400">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-xl bg-black/40 border border-white/15 px-3 py-2.5 text-sm outline-none focus:border-white/60"
              />
            </div>

            {activeTab === "login" && (
              <div className="text-right">
                <Link to="/forgot-password" className="text-xs text-zinc-400 hover:text-white cursor-pointer transition">
                  Forgot password?
                </Link>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 rounded-full bg-white text-black py-2.5 text-sm font-medium disabled:opacity-60"
            >
              {submitting ? <Loader /> : activeTab === "login" ? "Continue" : "Create account"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[11px] text-zinc-400 uppercase tracking-widest">
              or continue with
            </span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Social auth */}
          <div className="space-y-3">
            <AuthButton 
              icon={FcGoogle} 
              text="Continue with Google" 
              onClick={() => handleGoogleSuccess()} 
              disabled={submitting} 
            />
            <AuthButton 
              icon={FaApple} 
              text="Continue with Apple" 
              onClick={() => toast.error("Apple login not configured")} 
              disabled={submitting} 
            />
          </div>

          <p className="mt-4 text-[11px] text-zinc-500 text-center">
            By continuing, you agree to MiniX’s Terms & Privacy Policy.
          </p>
        </motion.div>

        {/* RIGHT: VISUAL PANEL */}
        <div className="hidden lg:flex items-center justify-center relative rounded-3xl border border-white/10 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070&auto=format&fit=crop"
            alt="Fashion Model"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

          <div className="relative z-10 text-center px-10 mt-32">
            <h2 className="text-3xl font-semibold mb-3">
              Minimal streetwear.<br />Built for everyday.
            </h2>
            <p className="text-sm text-zinc-300 max-w-sm mx-auto">
              Join MiniX to track orders, manage addresses, and build your
              everyday fits effortlessly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
