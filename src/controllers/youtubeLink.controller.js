import YouTubeLink from "../models/youtubeLink.model.js";

/* ================= CREATE YOUTUBE LINK ================= */
export const createYouTubeLink = async (req, res) => {
    try {
        const { title, url } = req.body;

        if (!title || !url) {
            return res.status(400).json({
                message: "Title and URL are required"
            });
        }

        const link = await YouTubeLink.create({
            title,
            url,
            createdBy: req.user._id
        });

        res.status(201).json({
            success: true,
            message: "YouTube link added successfully",
            data: link
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ================= GET ALL YOUTUBE LINKS ================= */
export const getAllYouTubeLinks = async (req, res) => {
    try {
        const links = await YouTubeLink.find()
            .populate("createdBy", "name role");

        res.json({
            success: true,
            count: links.length,
            data: links
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ================= UPDATE YOUTUBE LINK ================= */
export const updateYouTubeLink = async (req, res) => {
    try {
        const link = await YouTubeLink.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!link) {
            return res.status(404).json({
                message: "YouTube link not found"
            });
        }

        res.json({
            success: true,
            message: "YouTube link updated successfully",
            data: link
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ================= DELETE YOUTUBE LINK ================= */
export const deleteYouTubeLink = async (req, res) => {
    try {
        const link = await YouTubeLink.findByIdAndDelete(req.params.id);

        if (!link) {
            return res.status(404).json({
                message: "YouTube link not found"
            });
        }

        res.json({
            success: true,
            message: "YouTube link deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};