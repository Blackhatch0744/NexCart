import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search, Eye, Filter } from "lucide-react";
import API_BASE_URL from "../../config";

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const { data } = await axios.get(`${API_BASE_URL}/api/orders/admin/all`, {
                withCredentials: true,
            });
            setOrders(data.orders || []);
        } catch (error) {
            console.error("Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await axios.put(
                `${API_BASE_URL}/api/orders/admin/${id}/status`,
                { status: newStatus },
                { withCredentials: true }
            );
            // Optimistic update
            setOrders((prev) =>
                prev.map((order) =>
                    order._id === id ? { ...order, orderStatus: newStatus } : order
                )
            );
        } catch (error) {
            console.error("Failed to update status");
            alert("Failed to update status");
        }
    };

    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
            statusFilter === "All" || order.orderStatus === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case "Delivered":
                return "bg-green-500/20 text-green-400";
            case "Shipped":
                return "bg-blue-500/20 text-blue-400";
            case "Processing":
                return "bg-yellow-500/20 text-yellow-400";
            case "Cancelled":
                return "bg-red-500/20 text-red-400";
            default:
                return "bg-white/10 text-white/60";
        }
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <h2 className="text-3xl font-semibold">Orders</h2>

                <div className="flex gap-4">
                    {/* Fliter */}
                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="appearance-none pl-4 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/30 text-sm h-full"
                        >
                            <option value="All">All Status</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                        <Filter size={16} className="absolute right-3 top-3 text-white/40 pointer-events-none" />
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-3 text-white/40" size={18} />
                        <input
                            type="text"
                            placeholder="Search Order ID or Email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/30 text-sm w-64"
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-white/60">Loading orders...</div>
            ) : (
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-white/60 text-sm uppercase">
                            <tr>
                                <th className="px-6 py-4 font-medium">Order ID</th>
                                <th className="px-6 py-4 font-medium">User</th>
                                <th className="px-6 py-4 font-medium">Items</th>
                                <th className="px-6 py-4 font-medium">Date</th>
                                <th className="px-6 py-4 font-medium">Total</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10 text-sm">
                            {filteredOrders.map((order) => (
                                <tr key={order._id} className="hover:bg-white/5 transition">
                                    <td className="px-6 py-4 font-mono text-white/50">
                                        #{order._id.slice(-6).toUpperCase()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-medium">{order.user?.name || "Unknown"}</p>
                                        <p className="text-xs text-white/50">{order.user?.email}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        {order.items.length} items
                                    </td>
                                    <td className="px-6 py-4 text-white/60">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 font-medium">
                                        ₹{order.totalAmount.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={order.orderStatus}
                                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                            className={`px-3 py-1 rounded-full text-xs border-none outline-none cursor-pointer ${getStatusColor(order.orderStatus)} bg-transparent`}
                                        >
                                            <option className="bg-black text-white" value="Processing">Processing</option>
                                            <option className="bg-black text-white" value="Shipped">Shipped</option>
                                            <option className="bg-black text-white" value="Delivered">Delivered</option>
                                            <option className="bg-black text-white" value="Cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredOrders.length === 0 && (
                        <div className="p-8 text-center text-white/40">
                            No orders found.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
