import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
    broadcastNotification,
    createOfferNotification,
    getSystemStats,
    getAllUsers,
    deleteUser,
    getAllProducts,
    deleteProduct,
    getMarketPrices,
    updateMarketPrice,
    getAllOrders
} from "../controller/admin.controller.js";

const router = express.Router();

const verifyAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: "Access denied. Admins only." });
    }
};

// Notification Routes
router.post("/notifications/broadcast", protectRoute, verifyAdmin, broadcastNotification);
router.post("/notifications/offer", protectRoute, verifyAdmin, createOfferNotification);

// Dashboard Stats
router.get("/stats", protectRoute, verifyAdmin, getSystemStats);

// User Management
router.get("/users", protectRoute, verifyAdmin, getAllUsers);
router.delete("/users/:id", protectRoute, verifyAdmin, deleteUser);

// Product Management
router.get("/products", protectRoute, verifyAdmin, getAllProducts);
router.delete("/products/:id", protectRoute, verifyAdmin, deleteProduct);

// Market Price Management
router.get("/prices", protectRoute, verifyAdmin, getMarketPrices);
router.post("/prices", protectRoute, verifyAdmin, updateMarketPrice);

// Order Management
router.get("/orders", protectRoute, verifyAdmin, getAllOrders);

export default router;
