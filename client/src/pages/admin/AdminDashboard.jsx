import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUser, FaBox, FaShoppingCart } from "react-icons/fa";

import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        users: 0,
        products: 0,
        orders: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get("http://localhost:5050/api/admin/stats", {
                    withCredentials: true
                });
                setStats(response.data);
            } catch (error) {
                console.error("Error fetching admin stats:", error);
            }
        };

        fetchStats();
    }, []);

    const cards = [
        { title: "Total Users", value: stats.users, icon: <FaUser />, color: "bg-blue-500", link: "/admin/users" },
        { title: "Active Products", value: stats.products, icon: <FaBox />, color: "bg-green-500", link: "/admin/products" },
        { title: "Total Orders", value: stats.orders, icon: <FaShoppingCart />, color: "bg-purple-500", link: "/admin/orders" },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600">Overview of the platform performance.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cards.map((card, index) => (
                    <div
                        key={index}
                        onClick={() => navigate(card.link)}
                        className={`p-6 rounded-lg shadow-md text-white flex items-center justify-between ${card.color} cursor-pointer hover:opacity-90 transition-opacity`}
                    >
                        <div>
                            <p className="text-lg font-semibold opacity-90">{card.title}</p>
                            <p className="text-4xl font-bold mt-2">{card.value}</p>
                        </div>
                        <div className="text-5xl opacity-50">
                            {card.icon}
                        </div>
                    </div>
                ))}
            </div>

            {/* Placeholder for charts or recent activity */}
            <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div
                        onClick={() => navigate("/admin/prices")}
                        className="p-4 border rounded hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                        <h3 className="font-semibold text-green-700">Update Market Prices</h3>
                        <p className="text-sm text-gray-500">Set daily rates for crops.</p>
                    </div>
                    <div
                        onClick={() => navigate("/admin/products")}
                        className="p-4 border rounded hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                        <h3 className="font-semibold text-red-700">Review Inappropriate Products</h3>
                        <p className="text-sm text-gray-500">Check products flagged by users.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
