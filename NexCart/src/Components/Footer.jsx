import { useState } from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaYoutube, FaTwitter } from "react-icons/fa";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribeMessage, setSubscribeMessage] = useState("");

  // Social media links - placeholders for now, will be updated with actual links
  const socialLinks = {
    instagram: "#", // Will be updated with actual Instagram link
    facebook: "#",  // Will be updated with actual Facebook link
    youtube: "#",   // Will be updated with actual YouTube link
    twitter: "#"    // Will be updated with actual Twitter link
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email && email.includes("@")) {
      setSubscribeMessage("Thanks for subscribing! 🎉");
      setEmail("");
      setTimeout(() => setSubscribeMessage(""), 3000);
    } else {
      setSubscribeMessage("Please enter a valid email");
      setTimeout(() => setSubscribeMessage(""), 3000);
    }
  };

  const handleSocialClick = (platform, url) => {
    if (url === "#") {
      console.log(`${platform} link will be added soon`);
    } else {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <footer className="bg-[#060606] text-white pt-20 pb-10 mt-24 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-14">

        {/* Stay Updated */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Stay Updated</h3>
          <p className="text-gray-400 text-sm mb-5">
            Get updates on new drops & exclusive member-only offers.
          </p>

          <form onSubmit={handleSubscribe} className="w-full max-w-sm">
            <div className="flex">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-black/40 border border-white/20 px-4 py-2 rounded-l-lg text-sm focus:border-white focus:outline-none"
                placeholder="Enter your email"
                required
              />
              <button
                type="submit"
                className="bg-white text-black px-5 py-2 rounded-r-lg font-semibold text-sm hover:bg-gray-200 transition"
              >
                GO
              </button>
            </div>
            {subscribeMessage && (
              <p className="text-xs mt-2 text-green-400">{subscribeMessage}</p>
            )}
          </form>
        </div>

        {/* Customer Support */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Customer Support</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>
              <Link to="/contact" className="hover:text-white transition cursor-pointer">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/orders" className="hover:text-white transition cursor-pointer">
                Track Orders
              </Link>
            </li>
            <li>
              <a href="#shipping" className="hover:text-white transition cursor-pointer">
                Shipping
              </a>
            </li>
            <li>
              <a href="#returns" className="hover:text-white transition cursor-pointer">
                Returns
              </a>
            </li>
            <li>
              <a href="#faqs" className="hover:text-white transition cursor-pointer">
                FAQs
              </a>
            </li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>
              <Link to="/about" className="hover:text-white transition cursor-pointer">
                About Us
              </Link>
            </li>
            <li>
              <a href="#careers" className="hover:text-white transition cursor-pointer">
                Careers
              </a>
            </li>
            <li>
              <a href="#blog" className="hover:text-white transition cursor-pointer">
                Blog
              </a>
            </li>
            <li>
              <a href="#privacy" className="hover:text-white transition cursor-pointer">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#terms" className="hover:text-white transition cursor-pointer">
                Terms & Conditions
              </a>
            </li>
          </ul>
        </div>

        {/* Connect */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Connect With Us</h3>

          <ul className="space-y-2 text-gray-400 text-sm mb-5">
            <li>
              <a href="mailto:support@minix.com" className="hover:text-white transition">
                📧 support@minix.com
              </a>
            </li>
            <li>
              <a href="tel:+919876543210" className="hover:text-white transition">
                📞 +91 98765 43210
              </a>
            </li>
            <li>📍 Bangalore, India</li>
          </ul>

          <div className="flex gap-5 text-2xl">
            <FaInstagram
              onClick={() => handleSocialClick("Instagram", socialLinks.instagram)}
              className="text-gray-400 hover:text-white hover:scale-110 transition cursor-pointer"
              aria-label="Instagram"
            />
            <FaFacebook
              onClick={() => handleSocialClick("Facebook", socialLinks.facebook)}
              className="text-gray-400 hover:text-white hover:scale-110 transition cursor-pointer"
              aria-label="Facebook"
            />
            <FaYoutube
              onClick={() => handleSocialClick("YouTube", socialLinks.youtube)}
              className="text-gray-400 hover:text-white hover:scale-110 transition cursor-pointer"
              aria-label="YouTube"
            />
            <FaTwitter
              onClick={() => handleSocialClick("Twitter", socialLinks.twitter)}
              className="text-gray-400 hover:text-white hover:scale-110 transition cursor-pointer"
              aria-label="Twitter"
            />
          </div>
        </div>
      </div>

      <p className="text-center text-gray-500 text-xs mt-16">
        © 2025 <span className="font-semibold">MiniX</span> — All rights reserved.
      </p>
    </footer>
  );
}
