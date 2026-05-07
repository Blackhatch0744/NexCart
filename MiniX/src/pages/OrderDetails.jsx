import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { ArrowLeft } from "lucide-react";

export default function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    try {
      const orders = JSON.parse(localStorage.getItem("minix-orders")) || [];
      const found = orders.find(o => o.orderId === orderId);
      setOrder(found || null);
    } catch {
      setOrder(null);
    }
  }, [orderId]);

  if (!order) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <h2 className="text-2xl">Order not found</h2>
          <button
            onClick={() => navigate("/orders")}
            className="px-6 py-3 bg-white text-black rounded-lg"
          >
            Back to Orders
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="pt-32 pb-24 max-w-4xl mx-auto px-4">
        <button
          onClick={() => navigate("/orders")}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"
        >
          <ArrowLeft size={18} /> Back to Orders
        </button>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
          <div>
            <p className="text-sm text-gray-400">Order ID</p>
            <p className="font-mono">{order.orderId}</p>
            <p className="text-sm text-gray-400 mt-1">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-400 mb-1">Delivery Address</p>
              <p>{order.address.name}</p>
              <p className="text-sm text-gray-300">
                {order.address.house}, {order.address.street}
              </p>
              <p className="text-sm text-gray-300">
                {order.address.city}, {order.address.state} – {order.address.pincode}
              </p>
              <p className="text-sm text-gray-300">
                Phone: {order.address.phone}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-400 mb-1">Payment</p>
              <p className="capitalize">{order.paymentMethod}</p>
              <p className="text-sm text-gray-300">
                Status: {order.paymentStatus}
              </p>
              <p className="text-sm text-gray-300 mt-2">
                Total: ${order.grandTotal.toFixed(2)}
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-400 mb-2">Items</p>
            <div className="space-y-3">
              {order.items.map(item => (
                <div key={item.id} className="flex justify-between">
                  <div>
                    <p>{item.name}</p>
                    <p className="text-sm text-gray-400">
                      {item.quantity} × ${item.price}
                    </p>
                  </div>
                  <p>${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
