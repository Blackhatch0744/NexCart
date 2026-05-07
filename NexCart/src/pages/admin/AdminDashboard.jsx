import React, { useEffect, useState } from "react";
import axios from "axios";
import { DollarSign, ShoppingBag, Users, Package } from "lucide-react";
import API_BASE_URL from "../../config";

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const { data } = await axios.get(`${API_BASE_URL}/api/admin/stats`, {
                withCredentials: true,
            });
            setStats(data);
        } catch (error) {
            console.error("Failed to fetch stats", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-white/60">Loading stats...</div>;

    return (
        <div>
            <h2 className="text-3xl font-semibold mb-8">Dashboard Overview</h2>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <StatCard
                    title="Total Revenue"
                    value={`₹${stats?.totalRevenue?.toLocaleString() || 0}`}
                    icon={<DollarSign size={24} />}
                    color="bg-green-500/20 text-green-400"
                />
                <StatCard
                    title="Total Orders"
                    value={stats?.totalOrders || 0}
                    icon={<ShoppingBag size={24} />}
                    color="bg-blue-500/20 text-blue-400"
                />
                <StatCard
                    title="Total Products"
                    value={stats?.totalProducts || 0}
                    icon={<Package size={24} />}
                    color="bg-purple-500/20 text-purple-400"
                />
                <StatCard
                    title="Total Users"
                    value={stats?.totalUsers || 0}
                    icon={<Users size={24} />}
                    color="bg-orange-500/20 text-orange-400"
                />
            </div>

            {/* Recent Orders */}
            <div>
                <h3 className="text-xl font-medium mb-4 text-white/80">
                    Recent Orders
                </h3>
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-white/60 text-sm uppercase">
                            <tr>
                                <th className="px-6 py-4 font-medium">Order ID</th>
                                <th className="px-6 py-4 font-medium">User</th>
                                <th className="px-6 py-4 font-medium">Total</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10 text-sm">
                            {stats?.recentOrders?.map((order) => (
                                <tr key={order._id} className="hover:bg-white/5 transition">
                                    <td className="px-6 py-4 font-mono text-white/50">
                                        #{order._id.slice(-6).toUpperCase()}
                                    </td>
                                    <td className="px-6 py-4">{order.user?.name || "N/A"}</td>
                                    <td className="px-6 py-4">
                                        ₹{order.totalAmount.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs ${order.orderStatus === "Delivered"
                                                ? "bg-green-500/20 text-green-400"
                                                : order.orderStatus === "Cancelled"
                                                    ? "bg-red-500/20 text-red-400"
                                                    : "bg-yellow-500/20 text-yellow-400"
                                                }`}
                                        >
                                            {order.orderStatus}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color }) {
    return (
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center justify-between">
            <div>
                <p className="text-white/60 text-sm mb-1">{title}</p>
                <p className="text-2xl font-bold">{value}</p>
            </div>
            <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
        </div>
    );
}
