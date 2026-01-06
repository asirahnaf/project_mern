import Notification from "../models/notification.model.js";
import { io, getReceiverSocketId } from "../socket/socket.js";
import User from "../models/user.model.js";

/**
 * Create a notification in the database and emit it via Socket.IO
 * @param {Object} data - Notification data
 * @param {string} data.userId - Recipient user ID
 * @param {string} data.type - Notification type (price_change, offer, admin_update)
 * @param {string} data.title - Notification title
 * @param {string} data.message - Notification message
 * @param {Object} [data.relatedProduct] - Optional product reference
 * @param {Object} [data.metadata] - Optional metadata
 */
export const createAndEmitNotification = async (data) => {
    try {
        const { userId, type, title, message, relatedProduct, metadata } = data;

        // Check user preferences
        const user = await User.findById(userId);
        if (!user || (user.notificationPreferences && !user.notificationPreferences[type])) {
            return; // User has disabled this notification type
        }

        // Create notification in DB
        const newNotification = new Notification({
            userId,
            type,
            title,
            message,
            relatedProduct,
            metadata,
        });

        await newNotification.save();

        // Emit via Socket.IO if user is online
        const receiverSocketId = getReceiverSocketId(userId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newNotification", newNotification);
        }
    } catch (error) {
        console.error("Error creating notification:", error);
    }
};

export const notifyPriceChange = async (userId, product, oldPrice, newPrice) => {
    const title = "Price Change Alert";
    const message = `The price of ${product.name} has changed from $${oldPrice} to $${newPrice}`;

    await createAndEmitNotification({
        userId,
        type: "price_change",
        title,
        message,
        relatedProduct: product._id,
        metadata: { oldPrice, newPrice }
    });
};

export const notifyOffer = async (userId, offerTitle, offerMessage) => {
    await createAndEmitNotification({
        userId,
        type: "offer",
        title: offerTitle,
        message: offerMessage,
    });
};

export const notifyAdminUpdate = async (userId, updateTitle, updateMessage) => {
    await createAndEmitNotification({
        userId,
        type: "admin_update",
        title: updateTitle,
        message: updateMessage,
    });
};
