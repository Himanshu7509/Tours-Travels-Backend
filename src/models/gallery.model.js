import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
    {
        packageId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Package",
            required: true
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        imageUrl: {
            type: String,
            required: true
        },

        caption: {
            type: String
        }
    },
    { timestamps: true }
);

const Gallery = mongoose.model("Gallery", gallerySchema);
export default Gallery;