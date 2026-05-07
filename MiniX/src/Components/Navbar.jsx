import React, { useState, useEffect, useMemo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  LogOut,
  LogIn,
  MapPin,
  CreditCard,
  Package,
  HelpCircle,
  Menu,
  X,
} from "lucide-react";
import productData from "../data/productData";

export default function Navbar() {
  const { cartItems, setIsCartOpen } = useCart();
  const { wishlist } = useWishlist();
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🔍 Search state
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      setIsSearching(true);
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/product/search?q=${query}`);
        if (data.success) {
          // Convert backend 'slug' to 'id' for frontend compatibility if needed
          const mapped = data.products.map(p => ({
            ...p,
            id: p.slug // Navbar uses .id for navigation
          }));
          setSuggestions(mapped);
        }
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300); // 300ms debounce
    return () => clearTimeout(timeoutId);
  }, [query]);


  const handleEnter = (e) => {
    if (e.key === "Enter") {
      if (suggestions.length > 0) {
        navigate(`/product/${suggestions[0].id}`);
        setQuery("");
        setShowResults(false);
      }
    }
  };


  return (
    <nav
      className={`
        fixed top-0 left-0 w-full z-50
        transition-all duration-300
        ${scrolled ? "glass py-3" : "bg-transparent py-5"}
      `}
    >
      <div className="max-w-[1250px] mx-auto px-6 flex items-center justify-between gap-6">
        {/* LOGO & SIDEBAR MENU */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white hover:text-gray-300 transition flex items-center justify-center pt-1"
            aria-label="Toggle sidebar menu"
          >
            {sidebarOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
          <div
            onClick={() => navigate("/")}
            className="text-2xl font-bold tracking-wide cursor-pointer"
          >
            MiniX
          </div>
        </div>

        {/* MID LINKS */}
        <ul className="hidden lg:flex gap-10 text-white/80 font-medium">
          {["shop", "about", "contact"].map((link) => (
            <NavLink
              key={link}
              to={`/${link}`}
              className={({ isActive }) =>
                `capitalize hover:text-white transition ${isActive ? "text-white font-semibold" : ""
                }`
              }
            >
              {link}
            </NavLink>
          ))}
        </ul>

        {/* SEARCH */}
        <div className="hidden md:flex relative w-64">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60"
          />
          <input
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowResults(true);
            }}
            onKeyDown={handleEnter}
            className="
              w-full bg-white/5 border border-white/10 rounded-xl
              py-2 pl-10 pr-3 text-sm text-white placeholder-white/40
              focus:border-white/40 focus:bg-white/10 transition outline-none
            "
          />

          {/* SEARCH RESULTS */}
          <AnimatePresence>
            {showResults && query && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="
                  absolute top-12 left-0 w-full
                  glass-card z-50
                  overflow-hidden
                "
              >
                {suggestions.length > 0 ? (
                  suggestions.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        navigate(`/product/${item.id}`);
                        setQuery("");
                        setShowResults(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-white/80 hover:bg-white/10 transition-colors"
                    >
                      {item.name}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-white/50">
                    No products found
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT ICONS */}
        <div className="flex items-center gap-6">
          {/* PROFILE */}
          <div className="relative">
            <User
              size={26}
              className="cursor-pointer hover:text-gray-300 transition"
              onClick={() => setProfileOpen(!profileOpen)}
            />

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="
                    absolute right-0 mt-3 w-52
                    glass-card p-4 z-50
                  "
                >
                  {user ? (
                    <>
                      <p className="text-white/80 text-sm mb-4">
                        Logged in as
                        <span className="block font-medium text-white mt-0.5">
                          {user.name}
                        </span>
                      </p>

                      <div className="flex flex-col gap-2">
                        <button onClick={() => navigate("/profile")} className="flex items-center gap-3 text-sm text-white/80 hover:text-white">
                          <User size={16} /> My Profile
                        </button>

                        <button onClick={() => navigate("/orders")} className="flex items-center gap-3 text-sm text-white/80 hover:text-white">
                          <Package size={16} /> Orders
                        </button>

                        <button onClick={() => navigate("/wishlist")} className="flex items-center gap-3 text-sm text-white/80 hover:text-white">
                          <Heart size={16} /> Wishlist
                        </button>

                        <button onClick={() => navigate("/addresses")} className="flex items-center gap-3 text-sm text-white/80 hover:text-white">
                          <MapPin size={16} /> Addresses
                        </button>

                        <button onClick={() => navigate("/payments")} className="flex items-center gap-3 text-sm text-white/80 hover:text-white">
                          <CreditCard size={16} /> Payments
                        </button>
                      </div>

                      <div className="border-t border-white/10 my-3" />

                      <button onClick={logoutUser} className="flex items-center gap-3 text-sm text-red-400 hover:text-red-300">
                        <LogOut size={16} /> Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => navigate("/auth")} className="flex items-center gap-3 text-sm text-white hover:text-gray-300 mb-2">
                        <LogIn size={16} /> Login / Sign Up
                      </button>

                      <button onClick={() => navigate("/help")} className="flex items-center gap-3 text-sm text-white/80 hover:text-white">
                        <HelpCircle size={16} /> Help & Support
                      </button>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* WISHLIST */}
          <div className="relative cursor-pointer" onClick={() => navigate(user ? "/wishlist" : "/auth")}>
            <Heart size={24} />
            {wishlist.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </div>

          {/* CART */}
          <div className="relative cursor-pointer" onClick={() => user ? setIsCartOpen(true) : navigate("/auth")}>
            <ShoppingBag size={24} />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </div>

        </div>
      </div>

      {/* SIDEBAR DRAWER */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-[280px] bg-[#0a0a0a] border-r border-white/10 z-50 overflow-y-auto"
            >
              <div className="p-6">
                {/* Close Button */}
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="absolute top-6 right-6 text-white/60 hover:text-white"
                >
                  <X size={24} />
                </button>

                {/* Logo */}
                <div className="text-2xl font-bold mb-8">MiniX</div>

                {/* Navigation Links */}
                <div className="space-y-4 mb-8">
                  <h3 className="text-xs uppercase text-white/40 font-semibold mb-3">
                    Navigation
                  </h3>
                  {["shop", "about", "contact"].map((link) => (
                    <NavLink
                      key={link}
                      to={`/${link}`}
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        `block text-lg capitalize hover:text-white transition ${isActive ? "text-white font-semibold" : "text-white/70"
                        }`
                      }
                    >
                      {link}
                    </NavLink>
                  ))}
                </div>

                {/* User Menu */}
                <div className="border-t border-white/10 pt-6">
                  {user ? (
                    <>
                      <p className="text-white/60 text-xs mb-1">Logged in as</p>
                      <p className="text-white font-medium mb-6">{user.name}</p>

                      <div className="space-y-3">
                        <button
                          onClick={() => {
                            navigate("/profile");
                            setSidebarOpen(false);
                          }}
                          className="flex items-center gap-3 text-white/80 hover:text-white w-full"
                        >
                          <User size={18} /> My Profile
                        </button>

                        <button
                          onClick={() => {
                            setIsCartOpen(true);
                            setSidebarOpen(false);
                          }}
                          className="flex items-center w-full gap-3 text-white/80 hover:text-white"
                        >
                          <ShoppingBag size={18} /> 
                          Cart {cartItems.length > 0 && <span className="bg-white text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full">{cartItems.length}</span>}
                        </button>

                        <button
                          onClick={() => {
                            navigate("/orders");
                            setSidebarOpen(false);
                          }}
                          className="flex items-center gap-3 text-white/80 hover:text-white w-full"
                        >
                          <Package size={18} /> Orders
                        </button>

                        <button
                          onClick={() => {
                            navigate("/wishlist");
                            setSidebarOpen(false);
                          }}
                          className="flex items-center w-full gap-3 text-white/80 hover:text-white"
                        >
                          <Heart size={18} /> 
                          Wishlist {wishlist.length > 0 && <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{wishlist.length}</span>}
                        </button>

                        <button
                          onClick={() => {
                            navigate("/addresses");
                            setSidebarOpen(false);
                          }}
                          className="flex items-center gap-3 text-white/80 hover:text-white w-full"
                        >
                          <MapPin size={18} /> Addresses
                        </button>

                        <button
                          onClick={() => {
                            navigate("/payments");
                            setSidebarOpen(false);
                          }}
                          className="flex items-center gap-3 text-white/80 hover:text-white w-full"
                        >
                          <CreditCard size={18} /> Payments
                        </button>

                        <div className="border-t border-white/10 my-4" />

                        <button
                          onClick={() => {
                            logoutUser();
                            setSidebarOpen(false);
                          }}
                          className="flex items-center gap-3 text-red-400 hover:text-red-300 w-full"
                        >
                          <LogOut size={18} /> Logout
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          navigate("/auth");
                          setSidebarOpen(false);
                        }}
                        className="flex items-center gap-3 text-white hover:text-gray-300 mb-4 w-full"
                      >
                        <LogIn size={18} /> Login / Sign Up
                      </button>

                      <button
                        onClick={() => {
                          navigate("/help");
                          setSidebarOpen(false);
                        }}
                        className="flex items-center gap-3 text-white/80 hover:text-white w-full"
                      >
                        <HelpCircle size={18} /> Help & Support
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
