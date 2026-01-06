import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaBell } from "react-icons/fa";
import { Link } from "react-router-dom";
import {
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    fetchNotifications,
} from "../features/notification/notificationSlice";
import { format } from "date-fns"; // Make sure to install date-fns if not available, or use native Date

const NotificationBell = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch();
    const { items, unreadCount } = useSelector((state) => state.notifications);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleToggle = () => {
        if (!isOpen) {
            // Refresh notifications when opening
            dispatch(fetchNotifications({ page: 1, limit: 5 }));
        }
        setIsOpen(!isOpen);
    };

    const handleMarkAsRead = (id, event) => {
        event.stopPropagation();
        dispatch(markNotificationAsRead(id));
    };

    const handleDelete = (id, event) => {
        event.stopPropagation();
        dispatch(deleteNotification(id));
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={handleToggle}
                className="relative p-2 text-gray-600 hover:text-green-600 transition-colors focus:outline-none"
            >
                <FaBell size={24} />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
                    <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h3 className="font-semibold text-gray-700">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={() => dispatch(markAllNotificationsAsRead())}
                                className="text-xs text-green-600 hover:underline"
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {!items || items.length === 0 ? (
                            <div className="p-4 text-center text-gray-500 text-sm">
                                No notifications
                            </div>
                        ) : (
                            items.slice(0, 5).map((notification) => (
                                <div
                                    key={notification._id}
                                    className={`p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${!notification.isRead ? "bg-green-50" : ""
                                        }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <p className={`text-sm ${!notification.isRead ? "font-semibold" : "text-gray-600"}`}>
                                                {notification.title}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                                {notification.message}
                                            </p>
                                            <p className="text-[10px] text-gray-400 mt-1">
                                                {new Date(notification.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>

                                        <div className="flex flex-col gap-2 ml-2">
                                            {!notification.isRead && (
                                                <button
                                                    onClick={(e) => handleMarkAsRead(notification._id, e)}
                                                    className="text-blue-500 hover:text-blue-700 text-xs"
                                                    title="Mark as read"
                                                >
                                                    •
                                                </button>
                                            )}
                                            <button
                                                onClick={(e) => handleDelete(notification._id, e)}
                                                className="text-gray-400 hover:text-red-500"
                                                title="Delete"
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="p-2 border-t border-gray-100 text-center bg-gray-50">
                        <Link
                            to="/notifications"
                            className="text-sm text-green-600 hover:text-green-800 font-medium"
                            onClick={() => setIsOpen(false)}
                        >
                            View All Notifications
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
