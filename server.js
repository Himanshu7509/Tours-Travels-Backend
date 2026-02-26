import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/auth.routes.js";
import createDefaultAdmin from "./src/utils/createDefaultAdmin.js";
import adminPackageRoutes from "./src/routes/admin.package.routes.js";
import managerPackageRoutes from "./src/routes/manager.package.routes.js"
import itineraryRoutes from "./src/routes/itinerary.routes.js"
import packageTypeRoutes from "./src/routes/packageType.routes.js";
import youtubeLinkRoutes from "./src/routes/youtubeLink.routes.js";
import bookingRoutes from "./src/routes/booking.routes.js"


dotenv.config();

const app = express();

connectDB();

// ✅ CREATE DEFAULT ADMIN
createDefaultAdmin();

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/admin", adminPackageRoutes);

app.use("/api/manager", managerPackageRoutes); // ✅ ADD THIS

app.use("/api/itinerary", itineraryRoutes);

app.use("/api/package-types", packageTypeRoutes);

app.use("/api/youtube-links", youtubeLinkRoutes);

app.use("/api/bookings", bookingRoutes);

app.get("/", (req, res) => {
    res.send("Al-Shifa Tour & Travels Backend is running locally!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});