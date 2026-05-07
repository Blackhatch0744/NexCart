// src/pages/Addresses.jsx
import React, { useState, useEffect } from "react";
import { ArrowLeft, MapPin, Plus, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import axios from "axios";
import API_BASE_URL from "../config";

export default function Addresses() {
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    house: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
    isDefault: false,
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/addresses`, {
        withCredentials: true,
      });
      setAddresses(data.addresses || []);
    } catch (error) {
      console.error("Failed to fetch addresses", error);
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
      !form.name ||
      !form.phone ||
      !form.house ||
      !form.city ||
      !form.state ||
      !form.pincode
    ) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/api/addresses`, form, {
        withCredentials: true,
      });
      fetchAddresses();
      setShowForm(false);
      setForm({
        name: "",
        phone: "",
        house: "",
        street: "",
        city: "",
        state: "",
        pincode: "",
        landmark: "",
        isDefault: false,
      });
    } catch (error) {
      console.error("Failed to save address", error);
      alert("Failed to save address");
    }
  };

  const removeAddress = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/addresses/${id}`, {
        withCredentials: true,
      });
      fetchAddresses();
    } catch (error) {
      console.error("Failed to delete address", error);
    }
  };

  const setDefault = async (id) => {
    try {
      await axios.patch(`${API_BASE_URL}/api/addresses/${id}/default`, {}, {
        withCredentials: true,
      });
      fetchAddresses();
    } catch (error) {
      console.error("Failed to set default address", error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="pt-32 pb-24 px-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-white/10"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-2xl font-semibold">My Addresses</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <button
            onClick={() => setShowForm(true)}
            className="border-2 border-dashed border-white/20 rounded-3xl h-56 flex flex-col items-center justify-center text-white/60 hover:border-white/40 transition"
          >
            <Plus size={28} />
            <span className="mt-2 text-sm">Add address</span>
          </button>

          {addresses.map((addr) => (
            <div
              key={addr._id}
              className="relative rounded-3xl border border-white/10 bg-white/5 p-5 flex flex-col justify-between"
            >
              {addr.isDefault && (
                <span className="absolute top-4 right-4 text-xs bg-white text-black px-3 py-1 rounded-full">
                  Default
                </span>
              )}

              <div className="flex gap-3">
                <MapPin size={18} className="text-white/50 mt-1" />
                <div>
                  <p className="font-medium">{addr.name}</p>
                  <p className="text-sm text-white/60">
                    {addr.house}, {addr.street}
                  </p>
                  <p className="text-sm text-white/60">
                    {addr.city}, {addr.state} – {addr.pincode}
                  </p>
                  <p className="text-sm text-white/60">
                    Phone: {addr.phone}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 mt-4 text-sm">
                {!addr.isDefault && (
                  <button
                    onClick={() => setDefault(addr._id)}
                    className="text-white/60 hover:text-white flex items-center gap-1"
                  >
                    <Check size={14} /> Set as default
                  </button>
                )}
                <button
                  onClick={() => removeAddress(addr._id)}
                  className="text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="w-full max-w-lg rounded-3xl bg-[#0b0b0b] border border-white/10 p-6">
              <h2 className="text-lg font-medium mb-4">Add new address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input className="input" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} />
                <input className="input" name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} />
                <input className="input sm:col-span-2" name="house" placeholder="Flat / House / Building" value={form.house} onChange={handleChange} />
                <input className="input sm:col-span-2" name="street" placeholder="Street / Area" value={form.street} onChange={handleChange} />
                <input className="input" name="city" placeholder="City" value={form.city} onChange={handleChange} />
                <input className="input" name="state" placeholder="State" value={form.state} onChange={handleChange} />
                <input className="input" name="pincode" placeholder="Pincode" value={form.pincode} onChange={handleChange} />
                <input className="input sm:col-span-2" name="landmark" placeholder="Landmark (optional)" value={form.landmark} onChange={handleChange} />
              </div>

              <label className="flex items-center gap-2 text-sm text-white/70 mt-4">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={form.isDefault}
                  onChange={handleChange}
                  className="accent-white"
                />
                Make this my default address
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
                  Save address
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
