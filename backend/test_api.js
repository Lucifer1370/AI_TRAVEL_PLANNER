const Groq = require("groq-sdk");
require("dotenv").config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const generateManualItinerary = async (details) => {
  const prompt = `
You are an AI Travel Planner.
Generate a structured travel itinerary based on these user inputs:
Destination: ${details.destination}
Duration: ${details.days} Days
Travelers: ${details.travelers || 1} People
Budget Level: ${details.budget}
Interests: ${details.interests || "Sightseeing, Local Food"}

Return ONLY valid JSON matching this exact structure:
{
  "passengerName": "N/A",
  "flightNumber": "N/A",
  "airline": "N/A",
  "departureCity": "Home",
  "arrivalCity": "${details.destination}",
  "departureDate": "TBD",
  "departureTime": "N/A",
  "arrivalTime": "N/A",
  "seat": "N/A",
  "pnr": "N/A",
  
  "destination": "${details.destination}",
  "durationDays": ${details.days}, 
  "travelersCount": ${details.travelers || 1}, 
  "budgetLevel": "${details.budget}",
  "interests": ["Sightseeing", "Local Food"],
  
  "budgetBreakdown": {
    "hotel": 7000, 
    "food": 3500,
    "transport": 2500,
    "activities": 5000,
    "total": 18000
  },
  
  "weather": {
    "temp": "31°C",
    "condition": "Sunny",
    "humidity": "58%",
    "bestTimeToVisit": "October to March"
  },
  
  "hotels": [
    {
      "name": "Luxury Hotel",
      "stars": "⭐⭐⭐⭐⭐",
      "price": "₹8,500"
    }
  ],
  
  "packingTips": ["Comfortable shoes", "appropriate clothing"],
  "emergencyNumbers": ["Police: 112", "Medical Help: 108"],
  "nearbyAttractions": ["Famous Landmark 1", "Local Market", "Main Street"],
  
  "summary": "Personalized travel plan.",
  
  "itinerary": [
    {
      "dayNumber": 1,
      "imageUrl": "landmark",
      "morning": {
        "title": "Morning Exploration",
        "activities": ["Visit local attractions", "Try authentic breakfast"],
        "food": "Local specialty breakfast"
      },
      "afternoon": {
        "title": "Afternoon Tour",
        "activities": ["Guided city tour", "Explore museums"],
        "food": "Traditional lunch at a local restaurant"
      },
      "evening": {
        "title": "Evening Relaxation",
        "activities": ["Walk in the public square", "Sunset viewing"],
        "food": "Dinner at a fine dining restaurant"
      }
    }
  ]
}

CRITICAL INSTRUCTIONS:
1. You must generate detailed suggestions for EXACTLY ${details.days} days in the "itinerary" array (dayNumber 1 to ${details.days}).
2. Do NOT leave any day empty or omit any fields. For every single day (from dayNumber 1 to ${details.days}), you MUST provide complete morning, afternoon, and evening sub-objects, each containing a "title", "activities" (array of strings), and "food" string.
3. Make the "budgetBreakdown" values realistic for a ${details.budget} budget for ${details.days} days.
4. Set the JSON attributes to:
5. Return ONLY the JSON object, do not wrap it in markdown code blocks.
`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.3,
  });

  return completion.choices[0].message.content;
};

generateManualItinerary({
  destination: "Goa",
  days: 3,
  travelers: 2,
  budget: "Medium",
  interests: "Beach, Sightseeing",
})
  .then((res) => {
    console.log("RESPONSE:");
    console.log(res);
    process.exit(0);
  })
  .catch((err) => {
    console.error("ERROR:", err);
    process.exit(1);
  });
