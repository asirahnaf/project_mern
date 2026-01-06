import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import {
    createBooking,
    getMyRentals,
    getOwnerRentals,
    updateRentalStatus
} from '../controller/rental.controller.js';

const router = express.Router();

router.post('/book', protectRoute, createBooking);
router.get('/my-rentals', protectRoute, getMyRentals);
router.get('/owner-requests', protectRoute, getOwnerRentals);
router.put('/:id/status', protectRoute, updateRentalStatus);

export default router;
