import Package from "../models/package.model.js";

/* ================= CREATE PACKAGE ================= */
export const createPackage = async (req, res) => {
    try {
        const pkg = await Package.create({
            ...req.body,
            createdBy: req.user._id
        });

        res.status(201).json({
            success: true,
            message: "Package created successfully",
            data: pkg
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ================= GET MY PACKAGES ================= */
export const getMyPackages = async (req, res) => {
    try {

        const packages = await Package.find()
            .select(
                "packageId title duration description image paymentTerms CancellationAndRefundPolicy PackagesByTheme Inclusions Exclusions createdBy createdAt"
            );

        res.status(200).json({
            success: true,
            count: packages.length,
            data: packages
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

/* ================= GET PACKAGE BY ID ================= */
export const getPackageById = async (req, res) => {
    try {

        const pkg = await Package.findById(req.params.id);

        if (!pkg) {
            return res.status(404).json({
                success: false,
                message: "Package not found"
            });
        }

        res.status(200).json({
            success: true,
            data: pkg
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

/* ================= UPDATE PACKAGE ================= */
export const updatePackage = async (req, res) => {
    try {
        const pkg = await Package.findOneAndUpdate(
            { _id: req.params.id, createdBy: req.user._id },
            req.body,
            { new: true }
        );

        if (!pkg) {
            return res.status(404).json({ message: "Package not found or unauthorized" });
        }

        res.json({
            success: true,
            message: "Package updated successfully",
            data: pkg
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ================= DELETE PACKAGE ================= */
export const deletePackage = async (req, res) => {
    try {
        const pkg = await Package.findOneAndDelete({
            _id: req.params.id,
            createdBy: req.user._id
        });

        if (!pkg) {
            return res.status(404).json({ message: "Package not found or unauthorized" });
        }

        res.json({
            success: true,
            message: "Package deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// export const uploadGalleryImage = async (req, res) => {
//     try {
//         if (!req.file || !req.file.location) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Image upload failed"
//             });
//         }

//         const galleryItem = new Gallery({
//             packageId: req.params.packageId,
//             userId: req.user.id,
//             imageUrl: req.file.location,
//             caption: req.body.caption
//         });

//         await galleryItem.save();

//         res.status(201).json({
//             success: true,
//             imageUrl: req.file.location
//         });

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             error: error.message
//         });
//     }
// };