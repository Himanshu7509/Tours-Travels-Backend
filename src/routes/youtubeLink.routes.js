import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import managerMiddleware from "../middlewares/managerMiddleware.js";

import {
    createYouTubeLink,
    getAllYouTubeLinks,
    updateYouTubeLink,
    deleteYouTubeLink
} from "../controllers/youtubeLink.controller.js";

const router = express.Router();

/* ADMIN & MANAGER ONLY */
router.post("/", authMiddleware, managerMiddleware, createYouTubeLink);
router.get("/", authMiddleware, managerMiddleware, getAllYouTubeLinks);
router.put("/:id", authMiddleware, managerMiddleware, updateYouTubeLink);
router.delete("/:id", authMiddleware, managerMiddleware, deleteYouTubeLink);

export default router;