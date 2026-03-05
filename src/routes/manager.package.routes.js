import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import managerMiddleware from "../middlewares/managerMiddleware.js";
import uploadToS3 from "../config/multerS3.js";

import {
    createPackage,
    getMyPackages,
    getPackageById,
    updatePackage,
    deletePackage,
    uploadGalleryImage
} from "../controllers/manager.package.controller.js";

const router = express.Router();

/* MANAGER PACKAGE CRUD */
router.post("/packages", authMiddleware, managerMiddleware, createPackage);
router.get("/packages", authMiddleware, managerMiddleware, getMyPackages);
router.get("/packages/:id", authMiddleware, managerMiddleware, getPackageById);
router.put("/packages/:id", authMiddleware, managerMiddleware, updatePackage);
router.delete("/packages/:id", authMiddleware, managerMiddleware, deletePackage);
// Upload single image

router.post(
    "/:packageId/upload",
    authMiddleware,
    uploadToS3.single("image"),
    uploadGalleryImage
);

export default router;