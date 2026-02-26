import PackageType from "../models/packageType.model.js";

/* ================= CREATE PACKAGE TYPE ================= */
export const createPackageType = async (req, res) => {
    try {
        const { name, price } = req.body;

        if (!name || !price) {
            return res.status(400).json({
                message: "Name and price are required"
            });
        }

        const exists = await PackageType.findOne({ name });
        if (exists) {
            return res.status(400).json({
                message: "Package type already exists"
            });
        }

        const packageType = await PackageType.create({ name, price });

        res.status(201).json({
            success: true,
            message: "Package type created successfully",
            data: packageType
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ================= GET ALL PACKAGE TYPES ================= */
export const getAllPackageTypes = async (req, res) => {
    try {
        const types = await PackageType.find();

        res.json({
            success: true,
            count: types.length,
            data: types
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ================= UPDATE PACKAGE TYPE ================= */
export const updatePackageType = async (req, res) => {
    try {
        const type = await PackageType.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!type) {
            return res.status(404).json({
                message: "Package type not found"
            });
        }

        res.json({
            success: true,
            message: "Package type updated successfully",
            data: type
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ================= DELETE PACKAGE TYPE ================= */
export const deletePackageType = async (req, res) => {
    try {
        const type = await PackageType.findByIdAndDelete(req.params.id);

        if (!type) {
            return res.status(404).json({
                message: "Package type not found"
            });
        }

        res.json({
            success: true,
            message: "Package type deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};