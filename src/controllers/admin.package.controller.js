import Package from "../models/package.model.js";

/* ================= CREATE PACKAGE ================= */
export const createPackage = async (req, res) => {
    try {
        const pkg = await Package.create({
            ...req.body,
            createdBy: req.user._id
        });

        res.status(201).json({
            success: true,
            message: "Package created successfully",
            data: pkg
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ================= GET ALL PACKAGES ================= */
export const getAllPackages = async (req, res) => {
    try {
        const packages = await Package.find()
            .populate("createdBy", "name email role");

        res.status(200).json({
            success: true,
            count: packages.length,
            data: packages
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ================= GET PACKAGE BY ID ================= */
export const getPackageById = async (req, res) => {
    try {
        const pkg = await Package.findById(req.params.id)
            .populate("createdBy", "name email");

        if (!pkg) {
            return res.status(404).json({
                message: "Package not found"
            });
        }

        res.status(200).json({
            success: true,
            data: pkg
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ================= UPDATE PACKAGE ================= */
export const updatePackage = async (req, res) => {
    try {
        const pkg = await Package.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!pkg) {
            return res.status(404).json({
                message: "Package not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Package updated successfully",
            data: pkg
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ================= DELETE PACKAGE ================= */
export const deletePackage = async (req, res) => {
    try {
        const pkg = await Package.findByIdAndDelete(req.params.id);

        if (!pkg) {
            return res.status(404).json({
                message: "Package not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Package deleted successfully"
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};