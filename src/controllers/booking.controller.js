import Booking from "../models/booking.model.js";
import PackageType from "../models/packageType.model.js";

// ✅ Create Booking
export const createBooking = async (req, res) => {
    try {
        const userId = req.user?._id; // logged-in user
        const bookingData = {
            ...req.body,
            userId: userId || null,
            isGuestBooking: !userId && !req.body.packageType
        };

        const booking = await Booking.create(bookingData);

        // Populate packageType
        await booking.populate("packageType", "name price");

        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: booking
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// ✅ Get all bookings
export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate("packageType", "name price");
        res.status(200).json({ success: true, count: bookings.length, data: bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ Get booking by ID
export const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate("packageType", "name price");
        if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
        res.status(200).json({ success: true, data: booking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ Update booking
export const updateBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }).populate("packageType", "name price");

        if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

        res.status(200).json({ success: true, message: "Booking updated successfully", data: booking });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// ✅ Delete booking
export const deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.id);
        if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

        res.status(200).json({ success: true, message: "Booking deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ Add existing PackageType to booking
export const addPackageToBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { packageTypeId } = req.body;

        const booking = await Booking.findById(bookingId);
        if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

        const packageType = await PackageType.findById(packageTypeId);
        if (!packageType) return res.status(404).json({ success: false, message: "PackageType not found" });

        booking.packageType = packageTypeId;

        if (booking.adultsNumber != null && booking.childrenNumber != null) {
            booking.totalPrice = packageType.price * (booking.adultsNumber + booking.childrenNumber);
        }

        await booking.save();
        await booking.populate("packageType", "name price");

        res.status(200).json({
            success: true,
            message: "PackageType added to booking successfully",
            data: booking
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};