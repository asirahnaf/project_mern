import Rental from '../models/rental.model.js';
import Equipment from '../models/equipment.model.js';

export const createBooking = async (req, res, next) => {
    try {
        const { equipmentId, startDate, endDate } = req.body;
        const renterId = req.user._id;

        // Restriction: Only farmers can rent
        if (req.user.role !== 'farmer') {
            return res.status(403).json({ message: 'Only farmers can rent equipment' });
        }

        const equipment = await Equipment.findById(equipmentId);
        if (!equipment) return res.status(404).json({ message: 'Equipment not found' });

        if (equipment.owner.toString() === renterId.toString()) {
            return res.status(400).json({ message: 'You cannot rent your own equipment' });
        }

        // Double Booking Check 
        // Find any booking for this equipment that overlaps with the requested dates
        // and is NOT cancelled or rejected.
        const start = new Date(startDate);
        const end = new Date(endDate);

        const conflictingRental = await Rental.findOne({
            equipment: equipmentId,
            status: { $in: ['pending', 'confirmed'] },
            $or: [
                { startDate: { $lt: end }, endDate: { $gt: start } }
            ]
        });

        if (conflictingRental) {
            return res.status(400).json({ message: 'Equipment is already booked for these dates' });
        }

        // Calculate total cost
        const oneDay = 24 * 60 * 60 * 1000;
        const days = Math.round(Math.abs((end - start) / oneDay)) + 1;
        const totalCost = days * equipment.dailyRate;

        const newRental = new Rental({
            equipment: equipmentId,
            renter: renterId,
            startDate: start,
            endDate: end,
            totalCost,
            status: 'pending'
        });

        await newRental.save();
        res.status(201).json(newRental);
    } catch (error) {
        next(error);
    }
};

export const getMyRentals = async (req, res, next) => {
    try {
        const rentals = await Rental.find({ renter: req.user._id })
            .populate('equipment')
            .sort({ createdAt: -1 });
        res.status(200).json(rentals);
    } catch (error) {
        next(error);
    }
};

export const getOwnerRentals = async (req, res, next) => {
    try {
        // Find equipment owned by this user
        const userEquipment = await Equipment.find({ owner: req.user._id }).select('_id');
        const equipmentIds = userEquipment.map(eq => eq._id);

        // Find rentals for these equipments
        const rentals = await Rental.find({ equipment: { $in: equipmentIds } })
            .populate('equipment')
            .populate('renter', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json(rentals);
    } catch (error) {
        next(error);
    }
};

export const updateRentalStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const { id } = req.params;

        const rental = await Rental.findById(id).populate('equipment');
        if (!rental) return res.status(404).json({ message: 'Rental not found' });

        // Verify the user is the owner of the equipment
        if (rental.equipment.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to manage this rental' });
        }

        rental.status = status;
        await rental.save();
        res.status(200).json(rental);
    } catch (error) {
        next(error);
    }
};
