import mongoose from "mongoose";

const marketPriceSchema = new mongoose.Schema(
    {
        cropName: {
            type: String,
            required: true,
            unique: true, // Only one price entry per crop type for simplicity in this version
            trim: true,
        },
        pricePerKg: {
            type: Number,
            required: true,
        },
        category: {
            type: String,
            enum: ["vegetable", "fruit", "grain", "other"],
            default: "other",
        },
        lastUpdated: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

const MarketPrice = mongoose.model("MarketPrice", marketPriceSchema);

export default MarketPrice;
