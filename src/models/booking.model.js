import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        // Contact / Guest info
        name: { type: String, required: function () { return !this.userId; } },
        email: { type: String, required: function () { return !this.userId; } },
        phoneNumber: { type: String },
        destination: { type: String },
        message: { type: String },

        // Logged-in user reference
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

        // Package Booking info
        dateFrom: { type: Date },
        dateTo: { type: Date },
        adultsNumber: { type: Number, min: [1, "At least 1 adult required"] },  // ✅ FIXED
        childrenNumber: { type: Number, default: 0, min: [0, "Children cannot be negative"] },
        packageType: { type: mongoose.Schema.Types.ObjectId, ref: "PackageType" },
        totalPrice: { type: Number },

        isGuestBooking: { type: Boolean, default: false }
    },
    { timestamps: true }
);

// 🔥 Pre-save hook with validation
bookingSchema.pre("save", async function (next) {
    try {
        if (this.packageType && this.adultsNumber >= 1 && this.childrenNumber >= 0) {
            const PackageType = mongoose.model("PackageType");
            const selectedPackage = await PackageType.findById(this.packageType);

            if (!selectedPackage) return next(new Error("PackageType not found"));
            if (this.dateFrom >= this.dateTo) return next(new Error("dateFrom must be before dateTo"));

            const totalPeople = this.adultsNumber + this.childrenNumber;
            this.totalPrice = selectedPackage.price * totalPeople;
        }

        // ✅ Always call next
        // next();
    } catch (error) {
        next(error);
    }
});

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;