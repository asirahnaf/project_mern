import express from "express";
import colors from "colors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import mongodbConfig from "./config/mongodb.config.js";
import messageRoute from "./routes/message.route.js";
import authRoute from "./routes/auth.route.js";
import productRoute from "./routes/product.route.js";
import userRoute from "./routes/user.route.js";
import cartRoute from "./routes/cart.route.js";
import orderRoute from "./routes/order.route.js";
import reviewRoute from "./routes/review.route.js";

import notificationRoute from "./routes/notification.route.js";
import marketRoute from "./routes/market.route.js";
import adminRoute from "./routes/admin.route.js";
import insuranceRoute from "./routes/insurance.route.js";

import equipmentRoute from "./routes/equipment.route.js";
import rentalRoute from "./routes/rental.route.js";

import cors from "cors";
import { app, server } from "./socket/socket.js";
import dotenv from "dotenv";

dotenv.config();

// const app = express(); // Removed as we import app from socket.js
const PORT = process.env.PORT || 5000;

// middlewares
app.use(
  cors({
    origin: "http://localhost:5173", // must match your frontend
    credentials: true, // allow cookies to be sent
  })
);

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

// routers
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/messages", messageRoute);
app.use("/api/product", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/order", orderRoute);
app.use("/api/review", reviewRoute);
app.use("/api/notifications", notificationRoute);
app.use("/api/market", marketRoute);
app.use("/api/admin", adminRoute);
app.use("/api/insurance", insuranceRoute);
app.use("/api/equipment", equipmentRoute);
app.use("/api/rental", rentalRoute);

// listen - allow skipping when SKIP_SERVER is set (useful for tests)
if (process.env.SKIP_SERVER !== 'true') {
  server.listen(PORT, () => {
    mongodbConfig();
    console.log(`Server Running on port ${PORT}`.bgMagenta.white);
  });
}
