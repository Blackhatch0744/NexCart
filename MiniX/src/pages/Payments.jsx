import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  CreditCard,
  Plus,
  Trash2,
  Check,
  Smartphone,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import axios from "axios";
import API_BASE_URL from "../config";

export default function Payments() {
  const navigate = useNavigate();

  const [methods, setMethods] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState("card"); // card | upi
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    upiId: "",
    isDefault: false,
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/payments`, {
        withCredentials: true,
      });
      setMethods(data.methods || []);
    } catch (error) {
      console.error("Failed to fetch payment methods", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    if (
      (type === "card" &&
        (!form.cardName || !form.cardNumber || !form.expiry)) ||
      (type === "upi" && !form.upiId)
    ) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      const payload = {
        type,
        isDefault: form.isDefault,
        ...(type === "card"
          ? {
            cardName: form.cardName,
            last4: form.cardNumber.slice(-4), // Store only last 4
            expiry: form.expiry,
          }
          : {
            upiId: form.upiId,
          }),
      };

      await axios.post(`${API_BASE_URL}/api/payments`, payload, {
        withCredentials: true,
      });

      fetchPayments();

      setForm({
        cardName: "",
        cardNumber: "",
        expiry: "",
        upiId: "",
        isDefault: false,
      });
      setShowForm(false);
    } catch (error) {
      console.error("Failed to save payment method", error);
      alert(error.response?.data?.message || "Failed to save payment method");
    }
  };

  const removeMethod = async (id) => {
    if (!window.confirm("Are you sure you want to remove this payment method?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/payments/${id}`, {
        withCredentials: true,
      });
      fetchPayments();
    } catch (error) {
      console.error("Failed to delete payment method", error);
    }
  };

  const setDefault = async (id) => {
    try {
      await axios.patch(`${API_BASE_URL}/api/payments/${id}/default`, {}, {
        withCredentials: true,
      });
      fetchPayments();
    } catch (error) {
      console.error("Failed to set default payment method", error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="pt-32 pb-24 px-4 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-white/10 transition"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-2xl font-semibold">Payments</h1>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Add */}
          <button
            onClick={() => setShowForm(true)}
            className="border-2 border-dashed border-white/20 rounded-3xl h-52 flex flex-col items-center justify-center text-white/60 hover:border-white/40 transition"
          >
            <Plus size={28} />
            <span className="mt-2 text-sm">Add payment method</span>
          </button>

          {/* Methods */}
          {methods.map((m) => (
            <div
              key={m._id}
              className="relative rounded-3xl border border-white/10 bg-white/5 p-5 flex flex-col justify-between"
            >
              {m.isDefault && (
                <span className="absolute top-4 right-4 text-xs bg-white text-black px-3 py-1 rounded-full">
                  Default
                </span>
              )}

              <div className="flex gap-3">
                {m.type === "card" ? (
                  <CreditCard size={20} className="text-white/50 mt-1" />
                ) : (
                  <Smartphone size={20} className="text-white/50 mt-1" />
                )}

                <div>
                  {m.type === "card" ? (
                    <>
                      <p className="font-medium">{m.cardName}</p>
                      <p className="text-sm text-white/60">
                        •••• •••• •••• {m.last4}
                      </p>
                      <p className="text-sm text-white/60">
                        Expiry: {m.expiry}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="font-medium">UPI</p>
                      <p className="text-sm text-white/60">{m.upiId}</p>
                    </>
                  )}
                </div>
              </div>

              <div className="flex gap-4 mt-4 text-sm">
                {!m.isDefault && (
                  <button
                    onClick={() => setDefault(m._id)}
                    className="text-white/60 hover:text-white flex items-center gap-1"
                  >
                    <Check size={14} /> Set as default
                  </button>
                )}
                <button
                  onClick={() => removeMethod(m._id)}
                  className="text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="w-full max-w-lg rounded-3xl bg-[#0b0b0b] border border-white/10 p-6">
              <h2 className="text-lg font-medium mb-4">
                Add payment method
              </h2>

              {/* Type Switch */}
              <div className="flex rounded-full bg-white/10 p-1 mb-4">
                {["card", "upi"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`flex-1 py-2 text-sm rounded-full transition ${type === t
                      ? "bg-white text-black"
                      : "text-white/60 hover:text-white"
                      }`}
                  >
                    {t === "card" ? "Card" : "UPI"}
                  </button>
                ))}
              </div>

              {/* Form */}
              {type === "card" ? (
                <div className="space-y-3">
                  <input
                    className="input"
                    name="cardName"
                    placeholder="Cardholder name"
                    value={form.cardName}
                    onChange={handleChange}
                  />
                  <input
                    className="input"
                    name="cardNumber"
                    placeholder="Card number"
                    value={form.cardNumber}
                    onChange={handleChange}
                  />
                  <input
                    className="input"
                    name="expiry"
                    placeholder="Expiry (MM/YY)"
                    value={form.expiry}
                    onChange={handleChange}
                  />
                </div>
              ) : (
                <input
                  className="input"
                  name="upiId"
                  placeholder="yourname@upi"
                  value={form.upiId}
                  onChange={handleChange}
                />
              )}

              <label className="flex items-center gap-2 text-sm text-white/70 mt-4">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={form.isDefault}
                  onChange={handleChange}
                  className="accent-white"
                />
                Make this default
              </label>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 rounded-full bg-white/10 py-2.5 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 rounded-full bg-white text-black py-2.5 text-sm font-medium"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
