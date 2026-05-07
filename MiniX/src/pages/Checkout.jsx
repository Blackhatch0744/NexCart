import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { ArrowLeft, MapPin } from "lucide-react";
import axios from "axios";
import API_BASE_URL from "../config";

export default function Checkout() {
  const { cartItems, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("COD");

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/addresses`, {
        withCredentials: true,
      });
      setAddresses(data.addresses || []);
      setSelectedAddress(data.addresses.find(a => a.isDefault) || data.addresses[0] || null);
    } catch (error) {
      console.error("Failed to fetch addresses", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrder = async () => {
    if (!selectedAddress) {
      alert("Please add an address before placing order.");
      navigate("/addresses");
      return;
    }

    if (paymentMethod === "ONLINE") {
      navigate("/payment", {
        state: {
          orderData: {
            items: cartItems.map(it => ({
              product: it.id,
              quantity: it.quantity || 1,
            })),
            shippingAddress: selectedAddress._id,
            paymentMethod: "Card",
            totalPrice: total + 5, // Include shipping
          }
        }
      });
      return;
    }

    const orderData = {
      items: cartItems.map(it => ({
        product: it.id,
        quantity: it.quantity || 1,
      })),
      shippingAddress: selectedAddress._id,
      paymentMethod: "COD",
    };

    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/orders`, orderData, {
        withCredentials: true,
      });

      if (data.success) {
        localStorage.setItem("minix-last-order", JSON.stringify(data.order));
        clearCart();
        navigate("/order-success");
      }
    } catch (err) {
      console.error("Order placement failed", err);
      alert(err.response?.data?.message || "Order placement failed");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="bg-black text-white min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <h2 className="text-2xl mb-3">Your cart is empty</h2>
          <Link
            to="/shop"
            className="px-6 py-3 bg-white text-black rounded-lg font-semibold"
          >
            Back to Shop
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />

      <section className="px-6 lg:px-20 py-16">
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8"
        >
          <ArrowLeft size={18} /> Back to Cart
        </Link>

        <h1 className="text-4xl font-bold mb-12">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* ADDRESS */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex justify-between mb-4">
                <h2 className="text-xl font-semibold">Delivery Address</h2>
                <button
                  onClick={() => navigate("/addresses")}
                  className="text-sm text-gray-400 hover:text-white"
                >
                  Change
                </button>
              </div>

              {loading ? (
                <p className="text-gray-400">Loading addresses...</p>
              ) : selectedAddress ? (
                <div className="flex gap-3">
                  <MapPin size={18} className="text-white/50 mt-1" />
                  <div>
                    <p className="font-medium">{selectedAddress.name}</p>
                    <p className="text-sm text-white/60">
                      {selectedAddress.house}, {selectedAddress.street}
                    </p>
                    <p className="text-sm text-white/60">
                      {selectedAddress.city}, {selectedAddress.state} – {selectedAddress.pincode}
                    </p>
                    <p className="text-sm text-white/60">
                      Phone: {selectedAddress.phone}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400">No address selected.</p>
              )}
            </div>

            {/* PAYMENT */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>

              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 rounded-lg border border-white/10 cursor-pointer hover:bg-white/5 transition">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="accent-white"
                  />
                  <span>Cash on Delivery</span>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-lg border border-white/10 cursor-pointer hover:bg-white/5 transition">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="ONLINE"
                    checked={paymentMethod === "ONLINE"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="accent-white"
                  />
                  <span>Online Payment (Card / GPay)</span>
                </label>
              </div>
            </div>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 h-fit"
          >
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

            {cartItems.map(item => (
              <div key={item.id} className="flex justify-between mb-3">
                <div>
                  <p>{item.name}</p>
                  <p className="text-sm text-gray-400">
                    {item.quantity} × ${item.price}
                  </p>
                </div>
                <p>${(item.quantity * item.price).toFixed(2)}</p>
              </div>
            ))}

            <div className="border-t border-white/10 my-4"></div>

            <div className="flex justify-between text-gray-300">
              <p>Total</p>
              <p>${(total + 5).toFixed(2)}</p>
            </div>

            <button
              onClick={handleOrder}
              className="w-full mt-6 bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-200"
            >
              Place Order
            </button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
