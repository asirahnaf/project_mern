import mongoose from "mongoose";
import Order from "./models/order.model.js";
import User from "./models/user.model.js";
import Product from "./models/product.model.js";
import dotenv from "dotenv";

dotenv.config();

const checkOrders = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log("Connected to MongoDB");

        const orders = await Order.find({});
        console.log(`Total Orders in DB: ${orders.length}`);

        if (orders.length > 0) {
            console.log("Sample Order:", JSON.stringify(orders[0], null, 2));

            const buyerId = orders[0].buyer;
            const buyer = await User.findById(buyerId);
            console.log("Buyer of First Order:", buyer ? buyer.username : "Unknown");
        } else {
            console.log("No orders found.");
        }

        mongoose.disconnect();
    } catch (error) {
        console.error("Error:", error);
    }
};

checkOrders();
