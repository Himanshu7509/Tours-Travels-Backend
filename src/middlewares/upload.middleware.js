import multer from "multer";
import multerS3 from "multer-s3";

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.S3_BUCKET_NAME,
        acl: "public-read",
        key: (req, file, cb) => {
            cb(null, `packages/${Date.now()}-${file.originalname}`); // unique filename
        }
    })
});

export default uploadToS3;