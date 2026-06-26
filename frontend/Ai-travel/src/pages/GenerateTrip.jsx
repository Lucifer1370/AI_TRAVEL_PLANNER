import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "../services/api.js";
import toast from "react-hot-toast";
import {
  FaPlane,
  FaUser,
  FaTicketAlt,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaShareAlt,
  FaCopy,
  FaSyncAlt,
  FaCloudSun,
  FaHotel,
  FaWallet,
  FaMapMarkedAlt,
  FaCheck,
  FaExclamationTriangle,
  FaSuitcase,
  FaPrint,
  FaFilePdf,
} from "react-icons/fa";

const GenerateTrip = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    destination: "",
    days: "",
    travelers: "1",
    budget: "Medium",
    interests: "",
  });
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState(null);
  const [shareLink, setShareLink] = useState("");

  useEffect(() => {
    if (location.state) {
      setFormData({
        destination: location.state.destination || "",
        days: location.state.days || "",
        travelers: location.state.travelers || "1",
        budget: location.state.budget || "Medium",
        interests: "",
      });
    }
  }, [location.state]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.destination || !formData.days) {
      toast.error("Please fill in destination and number of days.");
      return;
    }
    setLoading(true);
    try {
      const response = await api.post("/itinerary/generate", formData);
      setItinerary(response.data.itinerary);
      toast.success("AI travel itinerary generated!");
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Failed to generate itinerary. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!itinerary) return;
    try {
      const response = await api.post(`/itinerary/${itinerary._id}/share`);
      const link = response.data.shareLink;
      setShareLink(link);
      navigator.clipboard.writeText(link);
      toast.success("Share link copied!");
    } catch (error) {
      toast.error("Failed to generate share link.");
    }
  };

  const handleReset = () => {
    setFormData({
      destination: "",
      days: "",
      travelers: "1",
      budget: "Medium",
      interests: "",
    });
    setItinerary(null);
    setShareLink("");
  };

  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (val) => {
    if (!val) return "₹0";
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val);
  };

  const getDestinationImage = (dest) => {
    return `https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80`;
  };

  const getDayImage = (keyword, index) => {
    const images = [
      "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1473116763269-255ea7b2f5f9?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&auto=format&fit=crop&q=80"
    ];
    return images[index % images.length];
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white px-4 md:px-6 py-12 relative overflow-hidden print:p-0 print:bg-white print:text-black">
      {}
      <div className="absolute top-20 left-10 h-96 w-96 rounded-full bg-blue-600/10 blur-[150px] -z-10 print:hidden"></div>
      <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-purple-600/10 blur-[150px] -z-10 print:hidden"></div>

      <div className="max-w-6xl mx-auto">
        {}
        {!itinerary && !loading && (
          <div className="text-center mb-12">
            <h1 className="text-5xl font-extrabold tracking-tight">
              Plan Your Custom
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                {" "}AI Trip
              </span>
            </h1>
            <p className="text-gray-400 mt-4 text-lg">
              Enter your preferences and let AI design the perfect travel itinerary for you.
            </p>
          </div>
        )}

        {}
        {loading && (
          <div className="max-w-md mx-auto my-12 bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl text-center space-y-6">
            <div className="flex justify-center">
              <FaSyncAlt className="text-blue-500 text-5xl animate-spin" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">AI is planning your trip...</h3>
              <p className="text-sm text-gray-400 mt-2">Generating customized day-wise recommendations</p>
            </div>
            <div className="w-full bg-black/40 rounded-full h-2.5 overflow-hidden border border-white/5">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full animate-[pulse_1.5s_infinite]" style={{ width: "100%" }}></div>
            </div>
          </div>
        )}

        {}
        {!itinerary && !loading && (
          <form
            onSubmit={handleSubmit}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-6 shadow-2xl max-w-2xl mx-auto"
          >
            <div>
              <label className="text-sm font-semibold text-gray-300 block mb-2">Destination</label>
              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                placeholder="e.g. Goa, Paris, Tokyo"
                className="w-full rounded-xl bg-black/40 p-4 outline-none border border-white/10 text-white text-sm focus:border-blue-500/50 transition"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-semibold text-gray-300 block mb-2">Number of Days</label>
                <input
                  type="number"
                  name="days"
                  value={formData.days}
                  onChange={handleChange}
                  placeholder="e.g. 5"
                  className="w-full rounded-xl bg-black/40 p-4 outline-none border border-white/10 text-white text-sm focus:border-cyan-500/50 transition"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-300 block mb-2">No. of Travelers</label>
                <input
                  type="number"
                  name="travelers"
                  value={formData.travelers}
                  onChange={handleChange}
                  placeholder="1"
                  className="w-full rounded-xl bg-black/40 p-4 outline-none border border-white/10 text-white text-sm focus:border-purple-500/50 transition"
                  min="1"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-300 block mb-2">Budget Level</label>
              <select
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="w-full rounded-xl bg-black/40 p-4 border border-white/10 text-white text-sm outline-none focus:border-yellow-500/50 transition cursor-pointer"
              >
                <option value="Low">Low Budget</option>
                <option value="Medium">Medium Budget</option>
                <option value="Luxury">Luxury / Premium</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-300 block mb-2">Travel Interests (Optional)</label>
              <input
                type="text"
                name="interests"
                value={formData.interests}
                onChange={handleChange}
                placeholder="e.g. Beach, Adventure, Culture, Food, Photography"
                className="w-full rounded-xl bg-black/40 p-4 outline-none border border-white/10 text-white text-sm focus:border-blue-500/50 transition"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-4 text-lg font-bold hover:scale-[1.02] active:scale-[0.98] duration-300 cursor-pointer shadow-lg shadow-blue-500/20"
            >
              ✈ Generate AI Trip Plan
            </button>
          </form>
        )}

        {}
        {itinerary && !loading && (
          <div className="space-y-8 print:space-y-4">
            
            {}
            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-gradient-to-br from-blue-900/40 via-slate-900/60 to-purple-900/40 p-8 md:p-10 backdrop-blur-xl">
              <div className="flex flex-col">
                <span className="text-blue-400 font-bold uppercase tracking-wider text-sm">AI Travel Itinerary</span>
                <h1 className="text-4xl md:text-5xl font-black mt-2 text-white bg-gradient-to-r from-white via-slate-200 to-gray-400 bg-clip-text text-transparent">
                  Trip to {itinerary.destination || itinerary.arrivalCity || "Destination"}
                </h1>
                <p className="text-gray-300 mt-4 text-sm md:text-base max-w-3xl leading-relaxed print:text-black">
                  {itinerary.summary || `Personalized day-wise itinerary recommendations.`}
                </p>
              </div>
            </div>

            {}
            {shareLink && (
              <div className="bg-blue-950/20 border border-blue-500/30 rounded-2xl p-4 flex items-center justify-between gap-4 text-sm animate-fade-in print:hidden">
                <span className="text-blue-300 truncate select-all">{shareLink}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(shareLink);
                    toast.success("Copied!");
                  }}
                  className="flex items-center gap-1 text-blue-400 hover:text-blue-300 font-semibold shrink-0 cursor-pointer"
                >
                  <FaCopy /> Copy
                </button>
              </div>
            )}

            {}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xl flex items-center gap-3 print:border-gray-300 print:bg-white print:text-black">
                <div className="p-3 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 print:bg-gray-100">
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase block">Destination</span>
                  <span className="font-bold text-sm">{itinerary.destination || itinerary.arrivalCity}</span>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xl flex items-center gap-3 print:border-gray-300 print:bg-white print:text-black">
                <div className="p-3 rounded-xl bg-purple-600/10 border border-purple-500/20 text-purple-400 print:bg-gray-100">
                  <FaCalendarAlt />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase block">Duration</span>
                  <span className="font-bold text-sm">{itinerary.durationDays || itinerary.itinerary?.length || 1} Days</span>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xl flex items-center gap-3 print:border-gray-300 print:bg-white print:text-black">
                <div className="p-3 rounded-xl bg-cyan-600/10 border border-cyan-500/20 text-cyan-400 print:bg-gray-100">
                  <FaUser />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase block">Travelers</span>
                  <span className="font-bold text-sm">{itinerary.travelersCount || 1} Person(s)</span>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xl flex items-center gap-3 print:border-gray-300 print:bg-white print:text-black">
                <div className="p-3 rounded-xl bg-yellow-600/10 border border-yellow-500/20 text-yellow-400 print:bg-gray-100">
                  <FaWallet />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase block">Estimated Budget</span>
                  <span className="font-bold text-sm">
                    {itinerary.budgetBreakdown?.total ? formatCurrency(itinerary.budgetBreakdown.total) : (itinerary.budgetLevel || "Medium")}
                  </span>
                </div>
              </div>

              <div className="col-span-2 md:col-span-1 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xl flex items-center gap-3 print:border-gray-300 print:bg-white print:text-black">
                <div className="p-3 rounded-xl bg-green-600/10 border border-green-500/20 text-green-400 print:bg-gray-100">
                  <FaSuitcase />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase block">Interests</span>
                  <span className="font-bold text-xs truncate block max-w-[120px]">
                    {itinerary.interests?.join(", ") || "Sightseeing"}
                  </span>
                </div>
              </div>
            </div>

            {}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
              <span className="text-sm font-semibold flex items-center gap-2">
                <span>Trip Progress</span>
                <span className="text-xs text-gray-400">({itinerary.durationDays || itinerary.itinerary?.length || 1} Days Planned)</span>
              </span>
              <div className="flex-1 max-w-md bg-black/40 rounded-full h-3 overflow-hidden border border-white/5">
                <div className="bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-500 h-3 rounded-full" style={{ width: "100%" }}></div>
              </div>
            </div>

            {}
            <div className="grid lg:grid-cols-3 gap-8 items-start print:grid-cols-1">
              
              {}
              <div className="lg:col-span-2 space-y-8 print:space-y-4">
                
                <h2 className="text-3xl font-extrabold flex items-center gap-2 border-b border-white/10 pb-2 print:text-black">
                  <span>📅 Day Wise Timeline</span>
                </h2>

                {itinerary.itinerary && itinerary.itinerary.length > 0 ? (
                  itinerary.itinerary.map((day, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl shadow-lg print:border-gray-300 print:bg-white print:text-black">
                      {}
                      <div className="bg-gradient-to-r from-blue-600/20 via-purple-600/10 to-transparent p-5 border-b border-white/10 flex items-center justify-between">
                        <h3 className="text-2xl font-extrabold text-white flex items-center gap-2">
                          <span className="text-blue-400">Day {day.dayNumber || idx + 1}</span>
                        </h3>
                      </div>

                      <div className="p-6 md:p-8 space-y-6 print:p-4">
                        {}
                        {day.morning && (
                          <div className="space-y-2">
                            <h4 className="text-blue-400 font-bold flex items-center gap-1.5 text-base print:text-blue-600">
                              <span>🌅 Morning:</span>
                              <span className="text-white text-sm font-semibold print:text-black">{day.morning.title}</span>
                            </h4>
                            <ul className="pl-5 space-y-1.5">
                              {day.morning.activities?.map((act, aIdx) => (
                                <li key={aIdx} className="text-sm text-gray-300 flex items-start gap-2 print:text-black">
                                  <span className="text-green-500 mt-1 shrink-0">✓</span>
                                  <span>{act}</span>
                                </li>
                              ))}
                              {day.morning.food && (
                                <li className="text-sm text-gray-300 flex items-start gap-2 print:text-black">
                                  <span className="text-green-500 mt-1 shrink-0">✓</span>
                                  <span>Food: {day.morning.food}</span>
                                </li>
                              )}
                            </ul>
                          </div>
                        )}

                        {}
                        {day.afternoon && (
                          <div className="space-y-2 pt-4 border-t border-white/5 print:border-gray-200">
                            <h4 className="text-purple-400 font-bold flex items-center gap-1.5 text-base print:text-purple-600">
                              <span>🍛 Afternoon:</span>
                              <span className="text-white text-sm font-semibold print:text-black">{day.afternoon.title}</span>
                            </h4>
                            <ul className="pl-5 space-y-1.5">
                              {day.afternoon.activities?.map((act, aIdx) => (
                                <li key={aIdx} className="text-sm text-gray-300 flex items-start gap-2 print:text-black">
                                  <span className="text-green-500 mt-1 shrink-0">✓</span>
                                  <span>{act}</span>
                                </li>
                              ))}
                              {day.afternoon.food && (
                                <li className="text-sm text-gray-300 flex items-start gap-2 print:text-black">
                                  <span className="text-green-500 mt-1 shrink-0">✓</span>
                                  <span>Food: {day.afternoon.food}</span>
                                </li>
                              )}
                            </ul>
                          </div>
                        )}

                        {}
                        {day.evening && (
                          <div className="space-y-2 pt-4 border-t border-white/5 print:border-gray-200">
                            <h4 className="text-cyan-400 font-bold flex items-center gap-1.5 text-base print:text-cyan-600">
                              <span>🌇 Evening:</span>
                              <span className="text-white text-sm font-semibold print:text-black">{day.evening.title}</span>
                            </h4>
                            <ul className="pl-5 space-y-1.5">
                              {day.evening.activities?.map((act, aIdx) => (
                                <li key={aIdx} className="text-sm text-gray-300 flex items-start gap-2 print:text-black">
                                  <span className="text-green-500 mt-1 shrink-0">✓</span>
                                  <span>{act}</span>
                                </li>
                              ))}
                              {day.evening.food && (
                                <li className="text-sm text-gray-300 flex items-start gap-2 print:text-black">
                                  <span className="text-green-500 mt-1 shrink-0">✓</span>
                                  <span>Food: {day.evening.food}</span>
                                </li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-10 bg-white/5 border border-white/10 rounded-3xl">No timeline data available.</p>
                )}

              </div>

              {}
              <div className="space-y-8 print:break-before-page print:space-y-4">
                {}
                {itinerary.budgetBreakdown && (
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl print:border-gray-300 print:bg-white print:text-black">
                    <h3 className="text-lg font-bold border-b border-white/10 pb-3 mb-4 flex items-center gap-2">
                      <FaWallet className="text-purple-400" />
                      <span>Estimated Budget</span>
                    </h3>
                    
                    <div className="space-y-3.5 text-sm">
                      <div className="space-y-1.5">
                        <div className="flex justify-between font-semibold">
                          <span>🏨 Accommodation</span>
                          <span>{formatCurrency(itinerary.budgetBreakdown.hotel)}</span>
                        </div>
                        <div className="bg-black/40 h-2 rounded-full overflow-hidden print:bg-gray-200">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: "38%" }}></div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between font-semibold">
                          <span>🍔 Food & Dining</span>
                          <span>{formatCurrency(itinerary.budgetBreakdown.food)}</span>
                        </div>
                        <div className="bg-black/40 h-2 rounded-full overflow-hidden print:bg-gray-200">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: "20%" }}></div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between font-semibold">
                          <span>🚕 Transport</span>
                          <span>{formatCurrency(itinerary.budgetBreakdown.transport)}</span>
                        </div>
                        <div className="bg-black/40 h-2 rounded-full overflow-hidden print:bg-gray-200">
                          <div className="bg-cyan-500 h-2 rounded-full" style={{ width: "15%" }}></div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between font-semibold">
                          <span>🎡 Sightseeing & Activities</span>
                          <span>{formatCurrency(itinerary.budgetBreakdown.activities)}</span>
                        </div>
                        <div className="bg-black/40 h-2 rounded-full overflow-hidden print:bg-gray-200">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "27%" }}></div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-white/10 flex justify-between items-center text-base font-extrabold print:border-gray-300">
                        <span>Total Trip Cost:</span>
                        <span className="text-blue-400 text-lg print:text-blue-700">
                          {formatCurrency(itinerary.budgetBreakdown.total)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {}
            <div className="flex flex-wrap gap-4 justify-center items-center bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-xl print:hidden">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-gray-300 font-semibold transition cursor-pointer"
              >
                <FaPrint /> Print Itinerary
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-gray-300 font-semibold transition cursor-pointer"
              >
                <FaFilePdf className="text-red-400" /> Save as PDF
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-extrabold hover:scale-105 active:scale-95 duration-200 cursor-pointer shadow-lg shadow-blue-500/30 text-base"
              >
                <FaShareAlt /> Share Itinerary Plan
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-gray-400 hover:text-white font-semibold transition cursor-pointer"
              >
                <FaSyncAlt /> Create Another Plan
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateTrip;