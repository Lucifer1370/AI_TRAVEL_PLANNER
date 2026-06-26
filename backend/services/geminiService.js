const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const generateItinerary = async (text) => {
    try {
        const prompt = `
You are a travel planner.

Extract travel details from this booking.

Return ONLY valid JSON.

Booking:

${text}
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
        });

        console.log("RAW RESPONSE:");
        console.log(response);

        return response.text;

    } catch (err) {

        console.error("Gemini Error:");
        console.error(err);

        throw err;
    }
};

module.exports = generateItinerary;