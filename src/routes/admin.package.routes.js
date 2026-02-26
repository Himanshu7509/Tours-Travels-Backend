import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

import {
    createPackage,
    getAllPackages,
    getPackageById,
    updatePackage,
    deletePackage
} from "../controllers/admin.package.controller.js";

const router = express.Router();

router.post(
    "/packages",
    authMiddleware,
    adminMiddleware,
    createPackage
);

router.get(
    "/packages",
    authMiddleware,
    adminMiddleware,
    getAllPackages
);

router.get(
    "/packages/:id",
    authMiddleware,
    adminMiddleware,
    getPackageById
);

router.put(
    "/packages/:id",
    authMiddleware,
    adminMiddleware,
    updatePackage
);

router.delete(
    "/packages/:id",
    authMiddleware,
    adminMiddleware,
    deletePackage
);

export default router;