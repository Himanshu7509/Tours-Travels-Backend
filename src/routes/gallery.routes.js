import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import uploadToS3 from "../config/multerS3.js";

import {
    uploadGalleryImage,
    getAllGallery,
    getGalleryByPackage,
    getGalleryById
} from "../controllers/gallery.controller.js";

const router = express.Router();

router.post(
    "/:packageId/upload",
    authMiddleware,
    uploadToS3.single("image"),
    uploadGalleryImage
);

router.get("/", getAllGallery);
router.get("/package/:packageId", getGalleryByPackage);
router.get("/:id", getGalleryById);

export default router;