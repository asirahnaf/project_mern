import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FaPaperPlane, FaBullhorn } from "react-icons/fa";

const BroadcastNotifications = () => {
    const [formData, setFormData] = useState({
        title: "",
        message: "",
        targetRole: "", // "" means All
        type: "admin_update"
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post("http://localhost:5050/api/admin/notifications/broadcast", formData, {
                withCredentials: true
            });
            toast.success("Notification broadcasted successfully!");
            setFormData({
                title: "",
                message: "",
                targetRole: "",
                type: "admin_update"
            });
        } catch (error) {
            console.error(error);
            toast.error("Failed to send notification.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-green-700 p-6 text-white flex items-center gap-4">
                    <FaBullhorn className="text-3xl" />
                    <div>
                        <h1 className="text-2xl font-bold">Broadcast Notification</h1>
                        <p className="opacity-90">Send alerts, updates, or offers to your users.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Notification Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="e.g. System Maintenance"
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Message Content
                        </label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            rows="4"
                            placeholder="Write your message here..."
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition resize-none"
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Target Audience
                            </label>
                            <select
                                name="targetRole"
                                value={formData.targetRole}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white"
                            >
                                <option value="">All Users</option>
                                <option value="farmer">Farmers Only</option>
                                <option value="buyer">Buyers Only</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Notification Type
                            </label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white"
                            >
                                <option value="admin_update">System Update (Info)</option>
                                <option value="offer">Special Offer</option>
                                <option value="warning">Warning / Alert</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex items-center justify-center gap-2 bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-transform transform active:scale-95 ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-green-800"
                                }`}
                        >
                            <FaPaperPlane />
                            {loading ? "Sending..." : "Send Broadcast"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BroadcastNotifications;
