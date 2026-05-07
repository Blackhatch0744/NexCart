import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { Package } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/orders/myorders`, {
        withCredentials: true,
      });
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="pt-32 pb-24 max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-semibold mb-8">Your Orders</h1>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center text-center mt-24">
            <Package size={64} className="text-white/40 mb-6" />
            <p className="text-white/60 mb-6">
              You haven’t placed any orders yet.
            </p>
            <Link
              to="/shop"
              className="px-6 py-3 bg-white text-black rounded-xl font-medium"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <Link
                key={order._id}
                to={`/orders/${order._id}`}
                className="block p-6 bg-gray-800 rounded-lg shadow-md hover:bg-gray-700 transition-colors duration-200"
              >
                <div className="flex justify-between mb-2">
                  <div>
                    <p className="text-sm text-gray-400">Order ID</p>
                    <p className="font-mono">{order._id}</p>
                  </div>
                  <p className="text-sm text-gray-400">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-400">
                      {order.items.length} item(s)
                    </p>
                    <p className="text-sm text-gray-400">
                      Payment: {order.paymentMethod.toUpperCase()}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-semibold">
                      ${order.totalAmount.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-400 capitalize">
                      {order.orderStatus}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div >
  );
}
