import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import { sendNotification } from "../socket/socket.js";

export const broadcastNotification = async (req, res) => {
    try {
        const { title, message, type = "admin_update", targetRole } = req.body;

        // Build query based on role
        const query = {};
        if (targetRole) {
            query.role = targetRole;
        }

        const users = await User.find(query);

        // Prepare notifications to insert
        const notificationsToInsert = [];
        const onlineUserIds = []; // We could optimize this but we'll iterate for now

        for (const user of users) {
            // Check preferences (optional, but good practice if we want to respect it)
            // Allow 'warning' or other new types if the preference is undefined (backward compatibility)
            const pref = user.notificationPreferences ? user.notificationPreferences[type] : true;
            if (pref === false) {
                continue;
            }

            const note = {
                userId: user._id,
                type,
                title,
                message,
                isRead: false,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            notificationsToInsert.push(note);
        }

        if (notificationsToInsert.length > 0) {
            const insertedNotifications = await Notification.insertMany(notificationsToInsert);

            // Emit events
            // Optimization: In a real large scale app, we'd use a queue or job.
            // Here we iterate.
            insertedNotifications.forEach(note => {
                sendNotification(note.userId.toString(), note);
            });
        }

        res.status(200).json({ message: `Notification sent to ${notificationsToInsert.length} users` });
    } catch (error) {
        console.error("Error broadcasting:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const createOfferNotification = async (req, res) => {
    try {
        const { title, message } = req.body;

        // Offers usually go to everyone, or maybe just buyers?
        // Let's assume buyers by default if not specified, or all.
        // Requirement says "Notify users about special offers".

        req.body.type = 'offer';
        await broadcastNotification(req, res); // Reuse broadcast logic
    } catch (error) {
        console.error("Error creating offer:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

/* --- New Stats & Management Logic --- */

import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import MarketPrice from "../models/marketPrice.model.js";

// 1. Dashboard Stats
export const getSystemStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();

        // Optional: Calculate total revenue if needed, for now just counts
        res.status(200).json({
            users: totalUsers,
            products: totalProducts,
            orders: totalOrders
        });
    } catch (error) {
        console.error("Error fetching stats:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// 2. User Management
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, "-password"); // Exclude password
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users" });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user" });
    }
};

// 3. Product Management
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate("owner", "username email");
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Error fetching products" });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await Product.findByIdAndDelete(id);
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting product" });
    }
};

// 4. Market Prices
export const getMarketPrices = async (req, res) => {
    try {
        const prices = await MarketPrice.find().sort({ updatedAt: -1 });
        res.status(200).json(prices);
    } catch (error) {
        res.status(500).json({ message: "Error fetching market prices" });
    }
};

export const updateMarketPrice = async (req, res) => {
    try {
        const { cropName, pricePerKg, category } = req.body;

        // Upsert: update if exists, insert if not
        const updatedPrice = await MarketPrice.findOneAndUpdate(
            { cropName: cropName },
            { pricePerKg, category, lastUpdated: Date.now() },
            { new: true, upsert: true }
        );

        res.status(200).json(updatedPrice);
    } catch (error) {
        console.error("Error updating price:", error);
        res.status(500).json({ message: "Error updating market price" });
    }
};

// 5. Orders
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("buyer", "username")
            .populate("product", "name pricePerKg")
            .sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders" });
    }
};

