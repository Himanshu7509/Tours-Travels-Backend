import express from "express";
import { uploadGalleryImage, upload, getPackageWithGallery, getAllPackagesWithGallery, deleteGalleryImage } from "../controllers/gallery.controller.js";

const router = express.Router();

router.post(
    "/upload",
    upload.single("image"),
    uploadGalleryImage
);

router.get("/package-gallery/:id", getPackageWithGallery);
router.get("/packages-with-gallery", getAllPackagesWithGallery);
router.delete("/delete-gallery/:id", deleteGalleryImage);

export default router;