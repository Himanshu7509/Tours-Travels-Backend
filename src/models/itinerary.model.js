import mongoose from "mongoose";

const itinerarySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },

        paragraph: {
            type: String,
            required: true
        },

        packageId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Package",
            required: true
        }
    },
    { timestamps: true }
);

const Itinerary = mongoose.model("Itinerary", itinerarySchema);
export default Itinerary;