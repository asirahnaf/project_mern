import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
} from "../features/notification/notificationSlice"; // Adjust path as needed
import { format } from "date-fns";
import { FaTrash, FaCheckCircle, FaBell } from "react-icons/fa";

const NotificationsPage = () => {
    const dispatch = useDispatch();
    const { items, loading, totalPages, currentPage } = useSelector((state) => state.notifications);
    const [filter, setFilter] = useState("all"); // all, unread, price_change, offer, admin_update

    useEffect(() => {
        dispatch(fetchNotifications({ page: 1, limit: 50 }));
    }, [dispatch]);

    const handleMarkAsRead = (id) => {
        dispatch(markNotificationAsRead(id));
    };

    const handleDelete = (id) => {
        dispatch(deleteNotification(id));
    };

    const handleMarkAllRead = () => {
        dispatch(markAllNotificationsAsRead());
    };

    const filteredItems = (items || []).filter(item => {
        if (filter === "all") return true;
        if (filter === "unread") return !item.isRead;
        return item.type === filter;
    });

    return (
        <div className="w-full max-w-5xl mx-auto p-6 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <FaBell className="text-teal-600" /> Notifications
                </h1>
                <button
                    onClick={handleMarkAllRead}
                    className="text-sm bg-teal-50 text-teal-700 px-4 py-2 rounded-lg hover:bg-teal-100 transition-colors"
                >
                    Mark All as Read
                </button>
            </div>

            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {['all', 'unread', 'price_change'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${filter === f
                            ? 'bg-teal-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1).replace('_', ' ')}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading notifications...</div>
                ) : filteredItems.length === 0 ? (
                    <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                        <FaBell className="text-4xl text-gray-300 mb-3" />
                        <p>No notifications found</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {filteredItems.map((notification) => (
                            <div
                                key={notification._id}
                                className={`p-4 hover:bg-gray-50 transition-colors ${!notification.isRead ? 'bg-teal-50/50' : ''}`}
                            >
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`w-2 h-2 rounded-full ${!notification.isRead ? 'bg-teal-500' : 'bg-transparent'}`}></span>
                                            <h3 className={`text-base ${!notification.isRead ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                                                {notification.title}
                                            </h3>
                                            <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-500 capitalize">
                                                {notification.type.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 text-sm mb-2 pl-4">
                                            {notification.message}
                                        </p>
                                        <p className="text-xs text-gray-400 pl-4">
                                            {new Date(notification.createdAt).toLocaleString()}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {!notification.isRead && (
                                            <button
                                                onClick={() => handleMarkAsRead(notification._id)}
                                                className="p-2 text-teal-600 hover:bg-teal-50 rounded-full transition-colors"
                                                title="Mark as Read"
                                            >
                                                <FaCheckCircle />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(notification._id)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                            title="Delete"
                                        >
                                            <FaTrash size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;
