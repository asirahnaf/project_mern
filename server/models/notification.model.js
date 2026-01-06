// models/Notification.js
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Index for faster queries
    },
    type: {
      type: String,
      enum: ["price_change", "offer", "admin_update", "warning"],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    relatedProduct: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true, // Index for filtering unread notifications
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
      // Can store: { oldPrice: 100, newPrice: 90, discountPercent: 10, etc. }
    },
  },
  { timestamps: true }
);

// Index for efficient querying by user and read status
notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
