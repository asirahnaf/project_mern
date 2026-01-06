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
            if (user.notificationPreferences && user.notificationPreferences[type] === false) {
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
