import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { addNotification, fetchUnreadCount } from "../features/notification/notificationSlice";
import { toast } from "react-hot-toast";

// Use environment variable or default to localhost
const SOCKET_URL = "";
// Using empty string allows the socket client to use the window.location (e.g. localhost:5173) 
// and the Vite proxy will forward /socket.io requests to localhost:5050

const useNotifications = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const socketRef = useRef(null);

    useEffect(() => {
        // Initial fetch of unread count
        if (user) {
            dispatch(fetchUnreadCount());
        }

        if (user && !socketRef.current) {
            // Initialize socket connection
            socketRef.current = io(SOCKET_URL, {
                query: { userId: user._id },
                transports: ["websocket"],
            });

            // Listen for new notifications
            socketRef.current.on("connect", () => {
                console.log("Socket connected:", socketRef.current.id);
            });

            socketRef.current.on("newNotification", (notification) => {
                console.log("Received new notification:", notification);
                // Update Redux state
                dispatch(addNotification(notification));

                // Show toast or browser notification
                toast(notification.message, {
                    icon: '🔔',
                    duration: 4000
                });

                // Optional: Play sound
                try {
                    const audio = new Audio('/notification.mp3'); // Ensure this file exists in public/
                    audio.play();
                } catch (e) {
                    console.error("Audio play failed", e);
                }
            });
        }

        // Cleanup
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [user, dispatch]);

    return socketRef.current;
};

export default useNotifications;
