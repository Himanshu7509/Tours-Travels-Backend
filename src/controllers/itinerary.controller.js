import Itinerary from "../models/itinerary.model.js";
import Package from "../models/package.model.js";

/* ================= ADD ITINERARY TO PACKAGE ================= */
export const addItinerary = async (req, res) => {
    try {
        const { packageId } = req.params;
        const { title, paragraph } = req.body;

        if (!title || !paragraph) {
            return res.status(400).json({
                message: "Title and paragraph are required"
            });
        }

        // ✅ Check package exists
        const pkg = await Package.findById(packageId);
        if (!pkg) {
            return res.status(404).json({
                message: "Package not found"
            });
        }

        const itinerary = await Itinerary.create({
            title,
            paragraph,
            packageId
        });

        res.status(201).json({
            success: true,
            message: "Itinerary added successfully",
            data: itinerary
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ================= GET ITINERARY BY PACKAGE ================= */
export const getItineraryByPackage = async (req, res) => {
    try {
        const { packageId } = req.params;

        const itinerary = await Itinerary.find({ packageId });

        res.json({
            success: true,
            count: itinerary.length,
            data: itinerary
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ================= UPDATE ITINERARY ================= */
export const updateItinerary = async (req, res) => {
    try {
        const { id } = req.params;

        const itinerary = await Itinerary.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );

        if (!itinerary) {
            return res.status(404).json({
                message: "Itinerary not found"
            });
        }

        res.json({
            success: true,
            message: "Itinerary updated successfully",
            data: itinerary
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ================= DELETE ITINERARY ================= */
export const deleteItinerary = async (req, res) => {
    try {
        const { id } = req.params;

        const itinerary = await Itinerary.findByIdAndDelete(id);

        if (!itinerary) {
            return res.status(404).json({
                message: "Itinerary not found"
            });
        }

        res.json({
            success: true,
            message: "Itinerary deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ================= GET ALL ITINERARIES ================= */
export const getAllItineraries = async (req, res) => {
    try {
        const itineraries = await Itinerary.find()
            .populate("packageId", "title packageId duration");

        res.json({
            success: true,
            count: itineraries.length,
            data: itineraries
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addPackageImage = async (req, res) => {
    try {
        const { packageId } = req.params;

        if (!req.file) {
            return res.status(400).json({ success: false, message: "No image uploaded" });
        }

        // Find the package and update its image
        const updatedPackage = await Package.findByIdAndUpdate(
            packageId,
            { image: req.file.location }, // S3 URL
            { new: true } // return the updated document
        );

        if (!updatedPackage) {
            return res.status(404).json({ success: false, message: "Package not found" });
        }

        res.status(200).json({
            success: true,
            message: "Image added successfully",
            data: updatedPackage
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};