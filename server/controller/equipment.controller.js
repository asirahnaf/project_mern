import Equipment from '../models/equipment.model.js';
import User from '../models/user.model.js';

export const createEquipment = async (req, res, next) => {
    try {
        const { name, description, category, dailyRate, location, images } = req.body;

        // Assuming user is attached to req by protectRoute middleware
        const owner = req.user._id;

        const newEquipment = new Equipment({
            name,
            description,
            category,
            dailyRate,
            location,
            images,
            owner
        });

        await newEquipment.save();
        res.status(201).json(newEquipment);
    } catch (error) {
        next(error);
    }
};

export const getAllEquipment = async (req, res, next) => {
    try {
        const { category, search } = req.query;
        let query = { available: true };

        if (category && category !== 'All') {
            query.category = category;
        }

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        const equipments = await Equipment.find(query).populate('owner', 'name email');
        res.status(200).json(equipments);
    } catch (error) {
        next(error);
    }
};

export const getEquipmentById = async (req, res, next) => {
    try {
        const equipment = await Equipment.findById(req.params.id).populate('owner', 'name email phone avatar');
        if (!equipment) return res.status(404).json({ message: 'Equipment not found' });
        res.status(200).json(equipment);
    } catch (error) {
        next(error);
    }
};

export const updateEquipment = async (req, res, next) => {
    try {
        const equipment = await Equipment.findById(req.params.id);
        if (!equipment) return res.status(404).json({ message: 'Equipment not found' });

        // Check ownership
        // Note: req.user comes from middleware protectRoute
        if (equipment.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not the owner of this equipment' });
        }

        const updatedEquipment = await Equipment.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedEquipment);
    } catch (error) {
        next(error);
    }
};

export const deleteEquipment = async (req, res, next) => {
    try {
        const equipment = await Equipment.findById(req.params.id);
        if (!equipment) return res.status(404).json({ message: 'Equipment not found' });

        if (equipment.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not the owner of this equipment' });
        }

        await Equipment.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Equipment has been deleted' });
    } catch (error) {
        next(error);
    }
};
