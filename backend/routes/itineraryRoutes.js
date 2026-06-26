const express = require("express");
const router = express.Router();

const auth = require("../middlewares/authMiddleware");

const {
    getHistory,
    deleteItinerary,
    getSingleItinerary,
    shareItinerary,
    getSharedItinerary,
    generateManualTrip,
} = require("../controllers/itineraryController");


router.post("/generate", auth, generateManualTrip);

router.get("/history", auth, getHistory);

router.get("/:id", auth, getSingleItinerary);

router.delete("/:id", auth, deleteItinerary);

router.post("/:id/share", auth, shareItinerary);


router.get("/share/:shareId", getSharedItinerary);

module.exports = router;