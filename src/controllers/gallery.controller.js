import Gallery from "../models/gallery.model.js";

/* UPLOAD IMAGE */
export const uploadGalleryImage = async (req, res) => {
    try {
        if (!req.file || !req.file.location) {
            return res.status(400).json({
                success: false,
                message: "Image upload failed"
            });
        }

        const galleryItem = new Gallery({
            packageId: req.params.packageId,
            userId: req.user.id,
            imageUrl: req.file.location,
            caption: req.body.caption
        });

        await galleryItem.save();

        res.status(201).json({
            success: true,
            imageUrl: req.file.location
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

/* GET ALL GALLERY */
export const getAllGallery = async (req, res) => {
    try {
        const gallery = await Gallery.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: gallery.length,
            data: gallery
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

/* GET GALLERY BY PACKAGE */
export const getGalleryByPackage = async (req, res) => {
    try {
        const gallery = await Gallery.find({
            packageId: req.params.packageId
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: gallery.length,
            data: gallery
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

/* GET GALLERY BY ID */
export const getGalleryById = async (req, res) => {
    try {
        const gallery = await Gallery.findById(req.params.id);

        if (!gallery) {
            return res.status(404).json({
                success: false,
                message: "Gallery not found"
            });
        }

        res.status(200).json({
            success: true,
            data: gallery
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};