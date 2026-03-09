import Package from "../models/package.model.js";
import Gallery from "../models/gallery.model.js";
import s3 from "../config/s3.js";
import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

const storage = multer.memoryStorage();

export const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }
});

const uploadToS3 = async (file) => {

    const fileKey = `alshifa-tour-travels/gallery/${uuidv4()}-${Date.now()}-${file.originalname}`;

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype
    };

    const uploaded = await s3.upload(params).promise();

    return uploaded.Location;
};

export const uploadGalleryImage = async (req, res) => {

    try {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded"
            });
        }

        const { caption, packageId } = req.body;

        if (!packageId) {
            return res.status(400).json({
                success: false,
                message: "packageId is required"
            });
        }

        const imageUrl = await uploadToS3(req.file);

        const galleryItem = new Gallery({
            userId: req.user?.id,
            packageId,   // link image with package
            imageUrl,
            caption
        });

        await galleryItem.save();

        res.status(201).json({
            success: true,
            message: "Image uploaded successfully",
            data: galleryItem
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Upload failed",
            error: error.message
        });

    }
};


export const getPackageWithGallery = async (req, res) => {

    try {

        const packageId = req.params.id;

        const packageData = await Package.findById(packageId);

        if (!packageData) {
            return res.status(404).json({
                success: false,
                message: "Package not found"
            });
        }

        const galleryImages = await Gallery.find({ packageId });

        res.status(200).json({
            success: true,
            package: packageData,
            gallery: galleryImages
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

export const getAllPackagesWithGallery = async (req, res) => {
    try {

        const packages = await Package.find();

        const packagesWithGallery = await Promise.all(
            packages.map(async (pkg) => {

                const galleryImages = await Gallery.find({
                    packageId: pkg._id
                });

                return {
                    ...pkg.toObject(),
                    gallery: galleryImages
                };

            })
        );

        res.status(200).json({
            success: true,
            count: packagesWithGallery.length,
            data: packagesWithGallery
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

export const deleteGalleryImage = async (req, res) => {
    try {

        const imageId = req.params.id;

        const galleryImage = await Gallery.findById(imageId);

        if (!galleryImage) {
            return res.status(404).json({
                success: false,
                message: "Image not found"
            });
        }

        // Extract file key from S3 URL
        const imageUrl = galleryImage.imageUrl;
        const fileKey = imageUrl.split(".com/")[1];

        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileKey
        };

        // Delete from S3
        await s3.deleteObject(params).promise();

        // Delete from MongoDB
        await Gallery.findByIdAndDelete(imageId);

        res.status(200).json({
            success: true,
            message: "Gallery image deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};