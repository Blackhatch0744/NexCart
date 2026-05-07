import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, ShoppingBag, ClipboardList, LogOut } from "lucide-react";

export default function AdminLayout() {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-black text-white flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/10 p-6 flex flex-col">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold tracking-tight">MiniX Admin</h1>
                </div>

                <nav className="flex-1 space-y-2">
                    <Link
                        to="/admin"
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${isActive("/admin")
                                ? "bg-white text-black font-medium"
                                : "text-white/60 hover:bg-white/5 hover:text-white"
                            }`}
                    >
                        <LayoutDashboard size={20} />
                        Dashboard
                    </Link>

                    <Link
                        to="/admin/products"
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${isActive("/admin/products")
                                ? "bg-white text-black font-medium"
                                : "text-white/60 hover:bg-white/5 hover:text-white"
                            }`}
                    >
                        <ShoppingBag size={20} />
                        Products
                    </Link>

                    <Link
                        to="/admin/orders"
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${isActive("/admin/orders")
                                ? "bg-white text-black font-medium"
                                : "text-white/60 hover:bg-white/5 hover:text-white"
                            }`}
                    >
                        <ClipboardList size={20} />
                        Orders
                    </Link>

                    <Link
                        to="/admin/users"
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${isActive("/admin/users")
                                ? "bg-white text-black font-medium"
                                : "text-white/60 hover:bg-white/5 hover:text-white"
                            }`}
                    >
                        <Users size={20} />
                        Customers
                    </Link>
                </nav>

                <div className="mt-auto pt-6 border-t border-white/10">
                    <Link
                        to="/"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-white transition"
                    >
                        <LogOut size={20} />
                        Back to Shop
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
}
