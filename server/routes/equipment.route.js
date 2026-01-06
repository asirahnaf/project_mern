import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import {
    createEquipment,
    getAllEquipment,
    getEquipmentById,
    updateEquipment,
    deleteEquipment
} from '../controller/equipment.controller.js';

const router = express.Router();

router.get('/', getAllEquipment);
router.get('/:id', getEquipmentById);

// Protected routes
router.post('/', protectRoute, createEquipment);
router.put('/:id', protectRoute, updateEquipment);
router.delete('/:id', protectRoute, deleteEquipment);

export default router;
