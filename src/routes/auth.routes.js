import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";
import adminOrManagerMiddleware from "../middlewares/adminOrManagerMiddleware.js";
const router = express.Router();

/* ================= REGISTER ================= */
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // ✅ Required fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // ✅ Allowed roles
        const allowedRoles = ["customer", "manager", "admin"];

        // ✅ Default role
        let userRole = "customer";

        // ❌ Block public manager/admin registration
        if (role && role !== "customer") {
            return res.status(403).json({
                message: "Manager/Admin registration is not allowed"
            });
        }

        // ✅ Check existing user
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // ✅ Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: userRole
        });

        // ✅ JWT
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// routes/admin.js
router.post(
    "/create-manager",
    authMiddleware,
    adminOrManagerMiddleware, // 👈 explained below
    async (req, res) => {
        try {
            const { name, email, password, role } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    message: "Email and password are required"
                });
            }

            // Role rules
            let userRole;

            if (req.user.role === "admin") {
                // admin can create admin or manager
                userRole = role === "manager" ? "manager" : "admin";
            } else {
                // manager can ONLY create manager
                userRole = "manager";
            }

            const userExists = await User.findOne({ email });
            if (userExists) {
                return res.status(400).json({
                    message: "User already exists"
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await User.create({
                name,
                email,
                password: hashedPassword,
                role: userRole
            });

            // ✅ Dynamic success message
            let successMessage = "User created successfully";

            if (userRole === "admin") {
                successMessage = "Admin created successfully";
            } else if (userRole === "manager") {
                successMessage = "Manager created successfully";
            }

            res.status(201).json({
                success: true,
                message: successMessage,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
);

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body; // ✅ REQUIRED

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email }).select("+password +role");
        if (!user) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            role: user.role
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/* ================= GET LOGGED-IN USER ================= */
router.get("/profile", authMiddleware, async (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user, // already fetched by ID
    });
});

router.get("/users/:id", authMiddleware, async (req, res) => {
    try {
        const userId = req.params.id;

        // 🔐 AUTHORIZATION CHECK (ADD HERE)
        if (req.user._id.toString() !== userId && req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied" });
        }

        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch user",
            error: error.message,
        });
    }
});

router.delete("/users/:id", authMiddleware, async (req, res) => {
    try {
        const userId = req.params.id;

        // 🔐 AUTHORIZATION CHECK
        if (req.user._id.toString() !== userId && req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied",
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        await User.findByIdAndDelete(userId);

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete user",
            error: error.message,
        });
    }
});

router.put("/update-profile", authMiddleware, async (req, res) => {
    try {
        const { name, phone } = req.body;

        if (
            (!name || name.trim() === "") &&
            (!phone || phone.trim() === "")
        ) {
            return res.status(400).json({ message: "Nothing to update" });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (name) user.name = name;
        if (phone) user.phone = phone;

        await user.save();

        res.json({
            success: true,
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get(
    "/admin/users",
    authMiddleware,
    roleMiddleware("admin"),
    async (req, res) => {
        try {
            const users = await User.find().select("-password");
            res.status(200).json({
                success: true,
                users
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to fetch users",
                error: error.message
            });
        }
    }
);

export default router;