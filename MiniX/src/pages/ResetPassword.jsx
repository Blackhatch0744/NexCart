import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API_BASE_URL from "../config";

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const { token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            return toast.error("Passwords do not match");
        }

        setLoading(true);

        try {
            const { data } = await axios.put(`${API_BASE_URL}/api/auth/resetpassword/${token}`, { password });
            toast.success(data.message || "Password reset successful!");
            navigate("/auth");
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen pt-20 px-4">
            <h2 className="text-3xl font-bold mb-6 text-rabble-red">Reset Password</h2>
            <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-4">
                <input
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="p-3 bg-white/5 border border-white/10 rounded focus:outline-none focus:border-rabble-red text-white"
                />
                <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="p-3 bg-white/5 border border-white/10 rounded focus:outline-none focus:border-rabble-red text-white"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-rabble-red text-white py-3 rounded hover:bg-red-700 transition disabled:opacity-50"
                >
                    {loading ? "Reset Password" : "Reset Password"}
                </button>
            </form>
        </div>
    );
};

export default ResetPassword;
