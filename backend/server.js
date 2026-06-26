const express = require("express")
const cors = require("cors")
const path = require("path")
require("dotenv").config()

const app = express()

app.use(cors())
app.use(express.json())

const connectDB = require("./config/db")
const authRoutes = require("./routes/authRoutes");

connectDB();
const uploadRoutes = require("./routes/uploadRoutes");
const itineraryRoutes = require("./routes/itineraryRoutes");

app.use("/api/upload", uploadRoutes);
app.use("/api/itinerary", itineraryRoutes);
app.use("/api/auth", authRoutes);

// Serve frontend static files in production
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/Ai-travel/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "../frontend/Ai-travel", "dist", "index.html"));
    });
} else {
    app.get("/", (req, res) => {
        res.send("Server Running");
    });
}

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})
