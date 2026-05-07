import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import API_BASE_URL from "../config";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data } = await axios.post(`${API_BASE_URL}/api/auth/forgotpassword`, { email });
            toast.success(data.message || "Email sent successfully!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen pt-20 px-4">
            <h2 className="text-3xl font-bold mb-6 text-rabble-red">Forgot Password</h2>
            <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-4">
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="p-3 bg-white/5 border border-white/10 rounded focus:outline-none focus:border-rabble-red text-white"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-rabble-red text-white py-3 rounded hover:bg-red-700 transition disabled:opacity-50"
                >
                    {loading ? "Sending..." : "Send Reset Link"}
                </button>
            </form>
            <div className="mt-4 text-gray-400">
                Wait, I remember my password... <Link to="/auth" className="text-rabble-red underline">Login</Link>
            </div>
        </div>
    );
};

export default ForgotPassword;
