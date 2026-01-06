import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
    broadcastNotification,
    createOfferNotification,
} from "../controller/admin.controller.js";

const router = express.Router();

const verifyAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: "Access denied. Admins only." });
    }
};

router.post("/notifications/broadcast", protectRoute, verifyAdmin, broadcastNotification);
router.post("/notifications/offer", protectRoute, verifyAdmin, createOfferNotification);

export default router;
