require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");
const express = require('express');
const app = express();

connectDB(); v

app.get('/', (req, res) => {
    res.send('Al-Shifa Tour & Travels Backend is running locally!');
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});