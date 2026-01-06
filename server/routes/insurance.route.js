import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
    createClaim,
    getFarmerClaims,
    getAllClaims,
    updateClaimStatus,
} from "../controllers/insurance.controller.js";

const router = express.Router();

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ error: "Access denied. Admins only." });
    }
};

// Farmer routes
router.post("/claims", protectRoute, createClaim);
router.get("/my-claims", protectRoute, getFarmerClaims);

// Admin routes
router.get("/all-claims", protectRoute, requireAdmin, getAllClaims);
router.put("/claims/:id", protectRoute, requireAdmin, updateClaimStatus);

export default router;
