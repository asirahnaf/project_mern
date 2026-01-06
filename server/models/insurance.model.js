import mongoose from "mongoose";

const insuranceClaimSchema = new mongoose.Schema(
    {
        farmerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        policyNumber: {
            type: String,
            default: () => "POL-" + Math.floor(100000 + Math.random() * 900000), // Check uniqueness in controller if needed, simple for now
        },
        cropName: {
            type: String,
            required: true,
        },
        incidentDate: {
            type: Date,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        incidentImage: {
            type: String, // URL to image
            default: "",
        },
        claimAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        status: {
            type: String,
            enum: ["Pending", "Approved", "Rejected"],
            default: "Pending",
        },
        adminComments: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

const InsuranceClaim = mongoose.model("InsuranceClaim", insuranceClaimSchema);

export default InsuranceClaim;
