import InsuranceClaim from "../models/insurance.model.js";

export const createClaim = async (req, res) => {
    try {
        const { cropName, incidentDate, description, incidentImage, claimAmount } = req.body;
        const farmerId = req.user._id;

        if (!cropName || !incidentDate || !description || !claimAmount) {
            return res.status(400).json({ error: "Please fill in all required fields" });
        }

        const newClaim = new InsuranceClaim({
            farmerId,
            cropName,
            incidentDate,
            description,
            incidentImage,
            claimAmount,
        });

        await newClaim.save();

        res.status(201).json(newClaim);
    } catch (error) {
        console.log("Error in createClaim controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getFarmerClaims = async (req, res) => {
    try {
        const farmerId = req.user._id;
        const claims = await InsuranceClaim.find({ farmerId }).sort({ createdAt: -1 });
        res.status(200).json(claims);
    } catch (error) {
        console.log("Error in getFarmerClaims controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getAllClaims = async (req, res) => {
    try {
        // Ideally verify admin here or in middleware
        const claims = await InsuranceClaim.find().populate("farmerId", "firstname lastname email").sort({ createdAt: -1 });
        res.status(200).json(claims);
    } catch (error) {
        console.log("Error in getAllClaims controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const updateClaimStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, adminComments } = req.body;

        if (!["Approved", "Rejected"].includes(status)) {
            return res.status(400).json({ error: "Invalid status" });
        }

        const claim = await InsuranceClaim.findByIdAndUpdate(
            id,
            { status, adminComments },
            { new: true }
        );

        if (!claim) {
            return res.status(404).json({ error: "Claim not found" });
        }

        res.status(200).json(claim);
    } catch (error) {
        console.log("Error in updateClaimStatus controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
