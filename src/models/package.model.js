import mongoose from "mongoose";

const packageSchema = new mongoose.Schema(
    {
        packageId: {
            type: String,
            unique: true
        },

        title: {
            type: String,
            required: true
        },

        duration: {
            type: String,
            required: true
        },

        description: String,

        image: {
            type: String // ✅ Single image URL from S3
        },

        paymentTerms: String,
        CancellationAndRefundPolicy: String,
        PackagesByTheme: String,
        Inclusions: [String],
        Exclusions: [String],

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    { timestamps: true }
);

// Auto generate packageId
packageSchema.pre("save", function () {
    if (!this.packageId) {
        this.packageId = `PKG-${Date.now()}`;
    }
});

const Package = mongoose.model("Package", packageSchema);
export default Package;