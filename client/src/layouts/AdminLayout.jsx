import React, { useEffect, useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import {
    FaChartPie,
    FaUsers,
    FaBoxOpen,
    FaTag,
    FaClipboardList,
    FaSignOutAlt,
    FaBell,
    FaShieldAlt
} from "react-icons/fa";
import { logoutAPI } from "../features/auth/authSlice";
import { FaHome } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
// NOTE: Assuming there's a logout action or similar, or we just clear storage.
// For now, I'll just use simple navigation.

const AdminLayout = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || user.role !== "admin") {
            navigate("/login");
        }
    }, [user, navigate]);

    const handleLogout = () => {
        dispatch(logoutAPI());
        navigate("/auth/signin");
    };

    const navItems = [
        { name: "Dashboard", path: "/admin", icon: <FaChartPie /> },
        { name: "Users", path: "/admin/users", icon: <FaUsers /> },
        { name: "Products", path: "/admin/products", icon: <FaBoxOpen /> },
        { name: "Market Prices", path: "/admin/prices", icon: <FaTag /> },
        { name: "Orders", path: "/admin/orders", icon: <FaClipboardList /> },
        { name: "Notifications", path: "/admin/notifications", icon: <FaBell /> },
        { name: "Insurance", path: "/admin/insurance", icon: <FaShieldAlt /> },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-green-900 text-white flex flex-col shadow-lg">
                <div className="p-6 text-2xl font-bold border-b border-green-800 flex items-center gap-2">
                    <span>AgriConnect</span>
                    <span className="text-xs bg-green-700 px-2 py-1 rounded">Admin</span>
                </div>

                <nav className="flex-1 overflow-y-auto py-4">
                    <ul className="space-y-1">
                        {navItems.map((item) => (
                            <li key={item.path}>
                                <NavLink
                                    to={item.path}
                                    end={item.path === "/admin"}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-6 py-3 transition-colors ${isActive
                                            ? "bg-green-700 border-r-4 border-green-400"
                                            : "hover:bg-green-800"
                                        }`
                                    }
                                >
                                    <span className="text-lg">{item.icon}</span>
                                    <span className="font-medium">{item.name}</span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="p-4 border-t border-green-800 space-y-2">
                    <button
                        onClick={() => navigate("/")}
                        className="flex items-center gap-3 px-4 py-2 w-full text-left hover:bg-green-800 rounded transition-colors text-white"
                    >
                        <FaHome />
                        <span>Go to Website</span>
                    </button>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2 w-full text-left hover:bg-green-800 rounded transition-colors text-red-200"
                    >
                        <FaSignOutAlt />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8">
                    <Outlet />
                </div>
            </main>

            <Toaster />
        </div>
    );
};

export default AdminLayout;
