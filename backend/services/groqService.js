const Groq = require("groq-sdk");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const generateItinerary = async (text, preferences = {}) => {
    const days = preferences.days || 3;
    const budget = preferences.budget || "Medium";
    const travelers = preferences.travelers || 1;

    const prompt = `
You are an AI Travel Planner.
Extract travel details from the booking document below (e.g. flight/hotel ticket), determine the destination/dates/passenger, and automatically generate a detailed day-by-day travel plan, and estimated budgets.

Booking details:
${text}

User Preferences:
- Duration: ${days} Days
- Budget: ${budget}
- Travelers: ${travelers}

Return ONLY valid JSON matching this exact structure:
{
  "passengerName": "Name of passenger or N/A",
  "flightNumber": "Flight/Train number or N/A",
  "airline": "Airline/Railway name or N/A",
  "transportType": "Flight, Train, Bus, or Unknown",
  "departureCity": "Origin city or Home",
  "arrivalCity": "Destination city",
  "departureDate": "Date or TBD",
  "departureTime": "N/A or time",
  "arrivalTime": "N/A or time",
  "seat": "Seat number or N/A",
  "pnr": "PNR code or N/A",
  
  "destination": "Destination name",
  "durationDays": ${days}, 
  "travelersCount": ${travelers}, 
  "budgetLevel": "${budget}",
  "interests": ["Beach", "Adventure", "Sightseeing"],
  
  "budgetBreakdown": {
    "hotel": 7000, 
    "food": 3500,
    "transport": 2500,
    "activities": 5000,
    "total": 18000
  },
  
  "summary": "Short travel overview paragraph.",
  
  "itinerary": [
    {
      "dayNumber": 1,
      "imageUrl": "landmark",
      "morning": {
        "title": "Morning activity title",
        "activities": ["Activity 1", "Activity 2"],
        "food": "Food suggestion"
      },
      "afternoon": {
        "title": "Afternoon activity title",
        "activities": ["Activity 1", "Activity 2"],
        "food": "Food suggestion"
      },
      "evening": {
        "title": "Evening activity title",
        "activities": ["Activity 1", "Activity 2"],
        "food": "Food suggestion"
      }
    }
  ]
}

CRITICAL REQUIREMENT: 
1. You MUST generate a complete itinerary plan for exactly ${days} days based on the User Preferences. Set "durationDays" to ${days}.
2. The "itinerary" array MUST contain elements for every single day from Day 1 to Day ${days}. 
3. For every single day, you must fully populate the "morning", "afternoon", and "evening" sub-objects with titles, activities (array of strings), and food recommendations. Do NOT leave any day empty, and do NOT omit any fields.
4. Calculate "budgetBreakdown" relative to the ${budget} budget for ${travelers} travelers across ${days} days.
`;

    const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            {
                role: "user",
                content: prompt,
            },
        ],
        temperature: 0.2,
    });

    return completion.choices[0].message.content;
};

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
   - "destination": "${details.destination}"
   - "durationDays": ${details.days}
   - "travelersCount": ${details.travelers || 1}
   - "budgetLevel": "${details.budget}"
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

module.exports = {
    generateItinerary,
    generateManualItinerary,
};