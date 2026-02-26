import mongoose from "mongoose";

const youtubeLinkSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        url: {
            type: String,
            required: true
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    { timestamps: true }
);

const YouTubeLink = mongoose.model("YouTubeLink", youtubeLinkSchema);
export default YouTubeLink;