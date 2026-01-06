import mongoose from 'mongoose';

const equipmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['Tractor', 'Harvester', 'Planter', 'Irrigation', 'Tool', 'Other'],
        default: 'Other'
    },
    dailyRate: {
        type: Number,
        required: true,
        min: 0
    },
    images: [{
        type: String
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    location: {
        type: String,
        required: true
    },
    available: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const Equipment = mongoose.model('Equipment', equipmentSchema);

export default Equipment;
