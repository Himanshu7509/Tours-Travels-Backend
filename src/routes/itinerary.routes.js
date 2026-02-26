import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
// import upload from "../middlewares/upload.middleware.js";
import upload from "../config/multer.js";
import managerMiddleware from "../middlewares/managerMiddleware.js";

import {
    addItinerary,
    getItineraryByPackage,
    updateItinerary,
    deleteItinerary,
    getAllItineraries,
    addPackageImage
} from "../controllers/itinerary.controller.js";

const router = express.Router();

router.get(
    "/",
    authMiddleware,
    managerMiddleware,
    getAllItineraries
);

/* CREATE ITINERARY */
router.post(
    "/:packageId",
    authMiddleware,
    managerMiddleware,
    addItinerary
);

/* UPDATE ITINERARY */
router.put(
    "/update/:id",
    authMiddleware,
    managerMiddleware,
    updateItinerary
);

/* DELETE ITINERARY */
router.delete(
    "/delete/:id",
    authMiddleware,
    managerMiddleware,
    deleteItinerary
);

/* GET ITINERARY BY PACKAGE (PUBLIC) */
router.get("/:packageId", getItineraryByPackage);

// Upload single image
router.post("/api/packages/:packageId/image", upload.single("image"), addPackageImage);

export default router;