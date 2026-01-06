import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/user.model.js";
import bcrypt from "bcrypt";

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log("Connected to MongoDB");

        const adminEmail = "admin@agriconnect.com";
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log("Admin user already exists");
            process.exit(0);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("admin123", salt);

        const adminUser = new User({
            firstname: "Super",
            lastname: "Admin",
            username: "superadmin",
            email: adminEmail,
            password: hashedPassword,
            role: "admin",
            gender: "other",
            phone: "1234567890",
            dob: new Date(),
            billingAddress: {
                fullname: "Super Admin",
                phone: "1234567890",
                street: "Admin St",
                city: "Admin City",
                postalCode: "12345"
            },
            profilePic: "https://via.placeholder.com/150"
        });

        await adminUser.save();
        console.log("Admin user created successfully!");
        console.log("Email: admin@agriconnect.com");
        console.log("Password: admin123");

        process.exit(0);
    } catch (error) {
        console.error("Error creating admin:", error);
        process.exit(1);
    }
};

createAdmin();
