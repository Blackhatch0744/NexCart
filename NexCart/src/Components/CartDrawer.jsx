import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { X, Trash2, ShoppingBag } from "lucide-react";

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, cartItems, removeFromCart, updateQuantity, total } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate("/checkout");
  };

  const handleCartReady = () => {
    setIsCartOpen(false);
    navigate("/cart");
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99]"
          />

          {/* Right-aligned Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-[400px] bg-[#0a0a09] border-l border-white/10 z-[100] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
              <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                <ShoppingBag size={20} /> Your Cart
              </h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-white transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-white/50">
                  <ShoppingBag size={48} className="mb-4 opacity-40" />
                  <p>Your cart is empty</p>
                  <button 
                    onClick={() => { setIsCartOpen(false); navigate("/shop"); }}
                    className="mt-6 text-sm text-white hover:underline"
                  >
                    Start shopping
                  </button>
                </div>
              ) : (
                cartItems.map((item, i) => (
                  <motion.div
                    key={`${item.id}-${item.selectedSize}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex gap-4 p-4 bg-white/5 border border-white/10 rounded-xl"
                  >
                    {/* Item Image */}
                    <img
                      src={item.images?.[0] || item.image}
                      alt={item.name}
                      className="w-20 h-24 object-cover rounded-lg shrink-0"
                    />

                    {/* Item Details */}
                    <div className="flex flex-col justify-between flex-1">
                      <div>
                        <h3 className="font-semibold text-white/90 text-sm line-clamp-1">{item.name}</h3>
                        <p className="text-white/50 text-xs mt-1">Size: {item.selectedSize}</p>
                        <p className="font-medium text-white/80 mt-1">${item.price}</p>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-3 bg-black/40 rounded-full px-2 py-1 border border-white/10">
                          <button onClick={() => updateQuantity(item.cartItemId, -1)} className="text-white/70 hover:text-white px-1">−</button>
                          <span className="text-xs w-4 text-center text-white">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.cartItemId, 1)} className="text-white/70 hover:text-white px-1">+</button>
                        </div>
                        <button onClick={() => removeFromCart(item.cartItemId)} className="text-white/40 hover:text-red-400 transition pr-1">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Sticky Footer */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-black/40 backdrop-blur-xl shrink-0">
                <div className="flex items-center justify-between mb-4 text-white">
                  <span className="text-white/70 font-medium">Subtotal</span>
                  <span className="text-lg font-bold">${total.toFixed(2)}</span>
                </div>
                <div className="space-y-3">
                  <button
                    onClick={handleCheckout}
                    className="w-full py-3.5 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-colors shadow-xl"
                  >
                    Checkout securely
                  </button>
                  <button
                    onClick={handleCartReady}
                    className="w-full py-3.5 border border-white/20 text-white font-medium rounded-xl hover:bg-white/10 transition-colors"
                  >
                    View Full Cart
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
