const Itinerary = require("../models/itineraryModel");
const { generateManualItinerary } = require("../services/groqService");

const getHistory = async (req, res) => {
    try {
        const itineraries = await Itinerary.find({
            user: req.user.id,
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: itineraries.length,
            itineraries,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const deleteItinerary = async (req, res) => {
    try {
        const itinerary = await Itinerary.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id,
        });

        if (!itinerary) {
            return res.status(404).json({
                success: false,
                message: "Itinerary not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Itinerary deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


const getSingleItinerary = async (req, res) => {
    try {
        const itinerary = await Itinerary.findOne({
            _id: req.params.id,
            user: req.user.id,
        });

        if (!itinerary) {
            return res.status(404).json({
                success: false,
                message: "Itinerary not found",
            });
        }

        res.status(200).json({
            success: true,
            itinerary,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
const { v4: uuidv4 } = require("uuid");

const shareItinerary = async (req, res) => {
    try {
        const itinerary = await Itinerary.findOne({
            _id: req.params.id,
            user: req.user.id,
        });

        if (!itinerary) {
            return res.status(404).json({
                success: false,
                message: "Itinerary not found",
            });
        }

        if (!itinerary.shareId) {
            itinerary.shareId = uuidv4();
            await itinerary.save();
        }

        res.status(200).json({
            success: true,
            shareLink: `http://localhost:5173/share/${itinerary.shareId}`,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
const getSharedItinerary = async (req, res) => {
    try {
        const itinerary = await Itinerary.findOne({
            shareId: req.params.shareId,
        });

        if (!itinerary) {
            return res.status(404).json({
                success: false,
                message: "Shared itinerary not found",
            });
        }

        res.status(200).json({
            success: true,
            itinerary,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const generateManualTrip = async (req, res) => {
    try {
        const { destination, days, travelers, budget, interests } = req.body;

        if (!destination || !days) {
            return res.status(400).json({
                success: false,
                message: "Destination and days are required",
            });
        }

        // Call AI planner
        const aiResponse = await generateManualItinerary({
            destination,
            days,
            travelers,
            budget,
            interests,
        });

        // Parse JSON
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("Failed to generate a valid itinerary JSON. Please try again.");
        }
        const cleaned = jsonMatch[0].trim();
        const itineraryData = JSON.parse(cleaned);

        // Save to DB with explicit field overrides to prevent LLM hallucinations
        const itinerary = await Itinerary.create({
            user: req.user.id,
            ...itineraryData,
            destination: destination || itineraryData.destination,
            durationDays: parseInt(days) || itineraryData.durationDays,
            travelersCount: parseInt(travelers) || itineraryData.travelersCount || 1,
            budgetLevel: budget || itineraryData.budgetLevel || "Medium",
            interests: (typeof interests === "string" && interests.trim())
                ? interests.split(",").map((i) => i.trim())
                : (Array.isArray(interests) ? interests : itineraryData.interests),
        });

        res.status(201).json({
            success: true,
            message: "Itinerary Generated Successfully",
            itinerary,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    getHistory,
    deleteItinerary,
    getSingleItinerary,
    shareItinerary,
    getSharedItinerary,
    generateManualTrip,
};