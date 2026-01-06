import express from "express";
import { getMarketPrices } from "../controller/admin.controller.js";

const router = express.Router();

// Public route to get market prices
// Reusing the controller logic from admin, but without admin verification
// In a larger app, you'd separate logic into a shared service.
router.get("/prices", getMarketPrices);

export default router;
