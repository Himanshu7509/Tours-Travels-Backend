import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import managerMiddleware from "../middlewares/managerMiddleware.js";
import {
   createBooking,
   getAllBookings,
   getBookingById,
   updateBooking,
   deleteBooking,
   addPackageToBooking
} from "../controllers/booking.controller.js";

const router = express.Router();

// POST: Guest or Logged-in booking
router.post("/", authMiddleware, createBooking);

// GET: All bookings (manager only)
router.get("/", authMiddleware, managerMiddleware, getAllBookings);

// GET: Single booking by ID
router.get("/:id", authMiddleware, getBookingById);

// PUT: Update booking
router.put("/update/:id", authMiddleware, updateBooking);

// DELETE: Delete booking (manager only)
router.delete("/delete/:id", authMiddleware, managerMiddleware, deleteBooking);

// PUT: Add existing packageType to booking
router.put("/add-package/:bookingId", authMiddleware, addPackageToBooking);

export default router;