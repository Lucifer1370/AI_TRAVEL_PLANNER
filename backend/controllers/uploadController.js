const extractText = require("../services/extractText");
const { generateItinerary } = require("../services/groqService");
const Itinerary = require("../models/itineraryModel");

const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Please upload a file." });
        }

        const extractedText = await extractText(req.file);
        const aiResponse = await generateItinerary(extractedText);

        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("Could not parse itinerary from the uploaded ticket. Please check the document format.");
        }
        
        const itineraryData = JSON.parse(jsonMatch[0].trim());
        const itinerary = await Itinerary.create({
            user: req.user.id,
            ...itineraryData
        });

        res.status(201).json({
            success: true,
            message: "Itinerary generated successfully",
            itinerary,
        });
    } catch (error) {
        console.error("Upload controller error:", error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    uploadFile,
};