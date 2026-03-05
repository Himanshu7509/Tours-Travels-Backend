import multer from "multer";

const upload = multer({
    storage: multer.memoryStorage(), // ✅ buffer required
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
            cb(new Error("Only image files are allowed"), false);
        }
        cb(null, true);
    }
});

export default upload;