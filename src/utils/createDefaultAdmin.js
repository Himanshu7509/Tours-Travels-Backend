import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

const createDefaultAdmin = async () => {
    try {
        const adminExists = await User.findOne({ role: "admin" });

        if (adminExists) {
            console.log("✅ Default admin already exists");
            return;
        }

        const hashedPassword = await bcrypt.hash(
            process.env.DEFAULT_ADMIN_PASSWORD,
            10
        );

        await User.create({
            name: process.env.DEFAULT_ADMIN_NAME,
            email: process.env.DEFAULT_ADMIN_EMAIL,
            password: hashedPassword,
            role: "admin"
        });

        console.log("🚀 Default admin created successfully");

    } catch (error) {
        console.error("❌ Error creating default admin:", error.message);
    }
};

export default createDefaultAdmin;