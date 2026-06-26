const extractText = require("../services/extractText");
const { generateItinerary } = require("../services/groqService");
const Itinerary = require("../models/itineraryModel");
const uploadFile = async (req, res) => {
    try {

        // Extract text
        const extractedText = await extractText(req.file);

        // AI Response
        const aiResponse = await generateItinerary(extractedText);

        // Extract JSON block from response
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("Failed to generate a valid itinerary JSON. Try uploading the document again.");
        }
        const cleaned = jsonMatch[0].trim();

        // Convert to Object
        const itineraryData = JSON.parse(cleaned);

        // Save to MongoDB
        const itinerary = await Itinerary.create({

            user: req.user.id,

            ...itineraryData

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
    uploadFile,
};