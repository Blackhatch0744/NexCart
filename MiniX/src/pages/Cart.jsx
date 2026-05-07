import React from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { Trash2, ShoppingBag } from "lucide-react";

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, total, clearCart } =
    useCart();
  const navigate = useNavigate();

  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />

      {/* HEADER */}
      <section className="text-center py-14">
        <h1 className="text-4xl font-bold">Your Cart</h1>
        <p className="text-gray-400 mt-2">
          Review your selected items
        </p>
      </section>

      {/* CART CONTENT */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="px-6 lg:px-20 pb-24"
      >
        {cartItems.length === 0 ? (
          /* EMPTY CART */
          <div className="flex flex-col items-center justify-center text-center py-24">
            <ShoppingBag size={64} className="text-gray-500 mb-6" />
            <h2 className="text-xl font-semibold mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-400 mb-6 max-w-sm">
              Looks like you haven’t added anything yet.
              Browse the shop and find something you’ll love.
            </p>
            <Link
              to="/shop"
              className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          /* CART WITH ITEMS */
          <div className="grid lg:grid-cols-3 gap-10">
            {/* LEFT: ITEMS */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item, i) => (
                <motion.div
                  key={`${item.id}-${item.selectedSize}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md shadow-lg"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.images?.[0]}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-xl"
                    />
                    <div>
                      <h3 className="text-lg font-semibold">
                        {item.name}
                      </h3>

                      {item.selectedColor && (
                        <p className="text-gray-400 text-sm">
                          Color:{" "}
                          <span className="text-white">
                            {item.selectedColor.name || item.selectedColor}
                          </span>
                        </p>
                      )}

                      <p className="text-gray-400 text-sm">
                        Size:{" "}
                        <span className="text-white">
                          {item.selectedSize}
                        </span>
                      </p>

                      <p className="font-semibold mt-2">
                        ${item.price}
                      </p>
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.cartItemId, -1)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition text-lg"
                    >
                      −
                    </button>
                    <span className="w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.cartItemId, 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition text-lg"
                    >
                      +
                    </button>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(item.cartItemId)}
                    className="text-gray-400 hover:text-red-500 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </motion.div>
              ))}
            </div>

            {/* RIGHT: SUMMARY */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-lg h-fit sticky top-28">
              <h2 className="text-xl font-semibold mb-6">
                Order Summary
              </h2>

              <div className="flex justify-between mb-2 text-gray-300">
                <p>Subtotal</p>
                <p>${total.toFixed(2)}</p>
              </div>

              <div className="flex justify-between mb-2 text-gray-300">
                <p>Shipping</p>
                <p>$5.00</p>
              </div>

              <div className="border-t border-white/10 my-4" />

              <div className="flex justify-between text-lg font-semibold">
                <p>Total</p>
                <p>${(total + 5).toFixed(2)}</p>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="w-full mt-6 bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={clearCart}
                className="w-full mt-3 bg-white/10 text-gray-300 py-3 rounded-lg hover:bg-white/20 transition"
              >
                Clear Cart
              </button>

              <Link
                to="/shop"
                className="block text-center text-gray-400 hover:text-white text-sm mt-4 transition"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </motion.section>

      <Footer />
    </div>
  );
}
