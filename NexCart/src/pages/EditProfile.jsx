import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const { user, updateProfile, updatePassword } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleProfileUpdate = async () => {
    await updateProfile(name, email);
    navigate("/profile");
  };

  const handlePasswordUpdate = async () => {
    await updatePassword(oldPassword, newPassword);
    setOldPassword("");
    setNewPassword("");
    alert("Password updated successfully!");
  };

  return (
    <div className="min-h-screen bg-[#050509] px-4 pt-24 pb-10 text-white relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-20 w-72 h-72 bg-purple-500/30 blur-[90px]" />
        <div className="absolute -bottom-40 -left-10 w-72 h-72 bg-sky-500/30 blur-[90px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-xl mx-auto bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <ArrowLeft
            size={20}
            className="cursor-pointer"
            onClick={() => navigate("/profile")}
          />
          <h1 className="text-xl font-semibold">Edit Profile</h1>
        </div>

        <div className="space-y-5">
          {/* Name */}
          <div>
            <label className="text-sm text-zinc-400">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 px-3 py-2 bg-white/10 border border-white/20 rounded-xl outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-zinc-400">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-3 py-2 bg-white/10 border border-white/20 rounded-xl outline-none"
            />
          </div>

          <button
            onClick={handleProfileUpdate}
            className="w-full py-2.5 bg-white text-black rounded-xl mt-2"
          >
            Save Changes
          </button>

          {/* Password Update */}
          <div className="border-t border-white/10 my-6 pt-6">
            <h2 className="text-lg font-semibold mb-4">Change Password</h2>

            <input
              type="password"
              placeholder="Current Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full mb-3 px-3 py-2 bg-white/10 border border-white/20 rounded-xl"
            />

            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full mb-3 px-3 py-2 bg-white/10 border border-white/20 rounded-xl"
            />

            <button
              onClick={handlePasswordUpdate}
              className="w-full py-2.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl"
            >
              Update Password
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
