import mongoose from 'mongoose';

const rentalSchema = new mongoose.Schema({
    equipment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Equipment',
        required: true
    },
    renter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    totalCost: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled', 'rejected'],
        default: 'pending'
    }
}, { timestamps: true });

// Prevent double booking on database level is hard with just unique index for ranges. 
// We will handle overlap logic in the controller.

const Rental = mongoose.model('Rental', rentalSchema);

export default Rental;
