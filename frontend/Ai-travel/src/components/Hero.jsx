import { useState } from "react";
import { FaLocationDot, FaCalendarDays } from "react-icons/fa6";
import { FaUsers } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Hero = () => {
    const navigate = useNavigate();
    const [destination, setDestination] = useState("");
    const [days, setDays] = useState("");
    const [travelers, setTravelers] = useState("");
    const [budget, setBudget] = useState("Medium");

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate("/generate-trip", {
            state: { destination, days, travelers, budget }
        });
    };

    return (
        <section className="relative overflow-hidden">
            {}
            <div className="absolute left-10 top-20 h-72 w-72 rounded-full bg-blue-600/20 blur-[120px]"></div>
            <div className="absolute right-10 bottom-20 h-72 w-72 rounded-full bg-purple-600/20 blur-[120px]"></div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">

                {}
                <div>

                    <span className="inline-flex items-center rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
                        ✈ AI Powered Travel Planner
                    </span>

                    <h1 className="mt-8 text-5xl lg:text-7xl font-extrabold leading-tight">
                        Plan Your
                        <br />
                        <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-500 bg-clip-text text-transparent">
                            Dream Journey
                        </span>
                    </h1>

                    <p className="mt-8 text-lg text-gray-400 leading-8 max-w-xl">
                        Create smart travel itineraries with AI. Discover hotels,
                        attractions, budgets and personalized plans in seconds.
                    </p>

                    <div className="mt-10 flex gap-5">
                        <Link
                            to="/generate-trip"
                            className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 font-semibold hover:scale-105 duration-300"
                        >
                            Generate Trip
                        </Link>

                        <button className="rounded-xl border border-white/20 px-8 py-4 hover:bg-white/10 duration-300">
                            Learn More
                        </button>
                    </div>

                    <div className="mt-12 flex items-center gap-8">

                        <div>
                            <h2 className="text-3xl font-bold text-blue-400">10K+</h2>
                            <p className="text-gray-400">Trips Planned</p>
                        </div>

                        <div>
                            <h2 className="text-3xl font-bold text-purple-400">100+</h2>
                            <p className="text-gray-400">Destinations</p>
                        </div>

                        <div>
                            <h2 className="text-3xl font-bold text-cyan-400">4.9★</h2>
                            <p className="text-gray-400">User Rating</p>
                        </div>

                    </div>

                </div>

                {}
                <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl">

                    <h2 className="text-3xl font-bold mb-8">
                        Generate Your Trip
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        <div>
                            <label className="text-gray-300 mb-2 block">
                                Destination
                            </label>

                            <div className="flex items-center rounded-xl border border-white/10 bg-black/30 px-4">
                                <FaLocationDot className="text-blue-400" />

                                <input
                                    type="text"
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    placeholder="e.g. Goa"
                                    className="w-full bg-transparent p-4 outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">

                            <div>
                                <label className="mb-2 block text-gray-300">
                                    Days
                                </label>

                                <div className="flex items-center rounded-xl border border-white/10 bg-black/30 px-4">
                                    <FaCalendarDays className="text-purple-400" />

                                    <input
                                        type="number"
                                        value={days}
                                        onChange={(e) => setDays(e.target.value)}
                                        placeholder="5"
                                        className="w-full bg-transparent p-4 outline-none"
                                        min="1"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-gray-300">
                                    Travelers
                                </label>

                                <div className="flex items-center rounded-xl border border-white/10 bg-black/30 px-4">
                                    <FaUsers className="text-cyan-400" />

                                    <input
                                        type="number"
                                        value={travelers}
                                        onChange={(e) => setTravelers(e.target.value)}
                                        placeholder="2"
                                        className="w-full bg-transparent p-4 outline-none"
                                        min="1"
                                    />
                                </div>
                            </div>

                        </div>

                        <div>
                            <label className="mb-2 block text-gray-300">
                                Budget
                            </label>

                            <select
                                value={budget}
                                onChange={(e) => setBudget(e.target.value)}
                                className="w-full rounded-xl border border-white/10 bg-black/30 p-4 outline-none cursor-pointer"
                            >
                                <option value="Low">Low Budget</option>
                                <option value="Medium">Medium Budget</option>
                                <option value="Luxury">Luxury</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-4 text-lg font-semibold hover:scale-[1.02] duration-300 cursor-pointer"
                        >
                            ✈ Generate AI Trip
                        </button>

                    </form>

                </div>

            </div>
        </section>
    );
};

export default Hero;