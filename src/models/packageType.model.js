import mongoose from "mongoose";

const packageTypeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            enum: ["Standard", "Deluxe", "Luxury"]
        },
        price: {
            type: Number,
            required: true
        }
    },
    { timestamps: true }
);

const PackageType = mongoose.model("PackageType", packageTypeSchema);

export default PackageType;