const mongoose = require("mongoose");

const itinerarySchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        shareId: {
            type: String,
            default: null,
        },

        
        passengerName: String,
        flightNumber: String,
        airline: String,
        departureCity: String,
        arrivalCity: String,
        departureDate: String,
        departureTime: String,
        arrivalTime: String,
        seat: String,
        pnr: String,

        
        destination: String,
        durationDays: Number,
        travelersCount: Number,
        budgetLevel: String,
        interests: [String],

        budgetBreakdown: {
            hotel: Number,
            food: Number,
            transport: Number,
            activities: Number,
            total: Number,
        },

        weather: {
            temp: String,
            condition: String,
            humidity: String,
            bestTimeToVisit: String,
        },

        hotels: [
            {
                name: String,
                stars: String,
                price: String,
            },
        ],

        packingTips: [String],
        emergencyNumbers: [String],
        nearbyAttractions: [String],

        summary: String,

        itinerary: [
            {
                dayNumber: Number,
                imageUrl: String,
                morning: {
                    title: String,
                    activities: [String],
                    food: String,
                },
                afternoon: {
                    title: String,
                    activities: [String],
                    food: String,
                },
                evening: {
                    title: String,
                    activities: [String],
                    food: String,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Itinerary", itinerarySchema);