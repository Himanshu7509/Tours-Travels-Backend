import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import managerMiddleware from "../middlewares/managerMiddleware.js";

import {
    createPackageType,
    getAllPackageTypes,
    updatePackageType,
    deletePackageType
} from "../controllers/packageType.controller.js";

const router = express.Router();

/* ADMIN & MANAGER */
router.post("/", authMiddleware, managerMiddleware, createPackageType);
router.get("/", authMiddleware, managerMiddleware, getAllPackageTypes);
router.put("/:id", authMiddleware, managerMiddleware, updatePackageType);
router.delete("/:id", authMiddleware, managerMiddleware, deletePackageType);

export default router;