import React, { useRef, useState } from "react";
import useSEO from "../hooks/useSEO";

import { motion } from "framer-motion";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import API_BASE_URL from "../config";

export default function Contact() {
  useSEO({
    title: "Contact Us",
    description:
      "Get in touch with the MiniX team. Have a question about your order, a product, or just want to say hello? We'd love to hear from you.",
    url: "/contact",
  });
  const form = useRef();
  const [status, setStatus] = useState({ type: "", message: "" });

  // ✉️ Function to send email
  const sendEmail = async (e) => {
    e.preventDefault();
    setStatus({ type: "loading", message: "Sending your message..." });

    const formData = new FormData(form.current);
    const data = {
      user_name: formData.get("user_name"),
      user_email: formData.get("user_email"),
      message: formData.get("message"),
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus({ type: "success", message: "✅ Message sent successfully!" });
        form.current.reset();
      } else {
        throw new Error(result.message || "Failed to send");
      }
    } catch (error) {
      console.error("Email Error:", error);
      setStatus({
        type: "error",
        message: "❌ Failed to send message. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />

      {/* Header */}
      <motion.section
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center py-16"
      >
        <h1 className="text-4xl font-bold mb-2">Get in Touch</h1>
        <p className="text-gray-400 text-lg">
          We'd love to hear from you — send us a message below 👇
        </p>
      </motion.section>

      {/* Contact Form */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex-1 flex justify-center px-6 pb-20"
      >
        <form
          ref={form}
          onSubmit={sendEmail}
          className="w-full max-w-lg bg-glass-dark border border-glass-border backdrop-blur-xl rounded-2xl p-8 shadow-lg"
        >
          <div className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-2">Your Name</label>
              <input
                type="text"
                name="user_name"
                required
                className="w-full px-4 py-3 rounded-lg bg-transparent border border-gray-700 focus:outline-none focus:border-white"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Your Email</label>
              <input
                type="email"
                name="user_email"
                required
                className="w-full px-4 py-3 rounded-lg bg-transparent border border-gray-700 focus:outline-none focus:border-white"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Message</label>
              <textarea
                name="message"
                required
                rows="5"
                className="w-full px-4 py-3 rounded-lg bg-transparent border border-gray-700 focus:outline-none focus:border-white resize-none"
                placeholder="Write your message..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-200"
              disabled={status.type === "loading"}
            >
              {status.type === "loading" ? "Sending..." : "Send Message"}
            </button>

            {status.message && (
              <p
                className={`text-center mt-4 ${status.type === "success"
                  ? "text-green-400"
                  : status.type === "error"
                    ? "text-red-400"
                    : "text-gray-400"
                  }`}
              >
                {status.message}
              </p>
            )}
          </div>
        </form>
      </motion.div>

      <Footer />
    </div>
  );
}
