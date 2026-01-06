import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
    getUserNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
} from "../controller/notification.controller.js";

const router = express.Router();

router.get("/", protectRoute, getUserNotifications);
router.get("/unread-count", protectRoute, getUnreadCount);
router.patch("/:id/read", protectRoute, markAsRead);
router.patch("/read-all", protectRoute, markAllAsRead);
router.delete("/:id", protectRoute, deleteNotification);

export default router;
