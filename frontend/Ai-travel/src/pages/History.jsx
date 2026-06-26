import { useEffect, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import {
  FaPlane,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTrashAlt,
  FaShareAlt,
  FaPlaneDeparture,
  FaClock,
  FaUser,
  FaTicketAlt,
  FaTimes,
  FaCopy,
  FaCloudSun,
  FaHotel,
  FaWallet,
  FaMapMarkedAlt,
  FaExclamationTriangle,
  FaSuitcase,
  FaPrint,
} from "react-icons/fa";

const History = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [shareLink, setShareLink] = useState("");

  const fetchHistory = async () => {
    try {
      const response = await API.get("/itinerary/history");
      setTrips(response.data.itineraries || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load travel history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this itinerary?")) return;
    try {
      await API.delete(`/itinerary/${id}`);
      setTrips(trips.filter((trip) => trip._id !== id));
      toast.success("Itinerary deleted successfully!");
      if (selectedTrip?._id === id) {
        setSelectedTrip(null);
      }
    } catch (error) {
      toast.error("Failed to delete itinerary.");
    }
  };

  const handleShare = async (id, e) => {
    e.stopPropagation();
    try {
      const response = await API.post(`/itinerary/${id}/share`);
      const link = response.data.shareLink;
      setShareLink(link);
      navigator.clipboard.writeText(link);
      toast.success("Share link copied to clipboard!");
    } catch (error) {
      toast.error("Failed to generate share link.");
    }
  };

  const formatCurrency = (val) => {
    if (!val) return "₹0";
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val);
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

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] text-white flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-400">Loading travel history...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white px-6 py-12 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-20 left-10 h-96 w-96 rounded-full bg-blue-600/10 blur-[150px] -z-10"></div>
      <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-purple-600/10 blur-[150px] -z-10"></div>

      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-extrabold text-white">Your Travel History</h1>
          <p className="text-gray-400 mt-2">View, share, or manage your previously generated itineraries.</p>
        </div>

        {/* Trips Grid */}
        {trips.length === 0 ? (
          <div className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl space-y-6">
            <FaPlaneDeparture className="text-gray-600 text-6xl mx-auto" />
            <h3 className="text-2xl font-bold text-white">No Trips Found</h3>
            <p className="text-gray-400 max-w-sm mx-auto">
              You haven't generated any travel itineraries yet. Head over to the Dashboard to parse your first ticket!
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip) => (
              <div
                key={trip._id}
                onClick={() => setSelectedTrip(trip)}
                className="group relative rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition hover:-translate-y-1 hover:border-blue-500/40 hover:bg-white/10 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Destination Header */}
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <h3 className="text-xl font-bold text-white leading-snug truncate max-w-[80%]">
                      {trip.destination || trip.arrivalCity || "Saved Route"}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-full shrink-0">
                      <FaPlane className="rotate-45" /> Active
                    </div>
                  </div>

                  {/* Summary/Details */}
                  <div className="space-y-3 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-xs text-purple-400" />
                      <span>{trip.durationDays || trip.itinerary?.length || 1} Days Planned</span>
                    </div>
                    {trip.budgetLevel && (
                      <div className="flex items-center gap-2">
                        <FaWallet className="text-xs text-cyan-400" />
                        <span>{trip.budgetLevel} Budget</span>
                      </div>
                    )}
                    {trip.passengerName && trip.passengerName !== "N/A" && (
                      <div className="flex items-center gap-2">
                        <FaUser className="text-xs text-yellow-400" />
                        <span className="truncate">{trip.passengerName}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions Bottom */}
                <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <FaClock /> {new Date(trip.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleShare(trip._id, e)}
                      className="p-2.5 rounded-xl border border-white/10 text-gray-300 hover:border-blue-500/50 hover:bg-blue-500/10 hover:text-blue-400 transition cursor-pointer"
                      title="Copy Share Link"
                    >
                      <FaShareAlt className="text-sm" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(trip._id, e)}
                      className="p-2.5 rounded-xl border border-white/10 text-gray-300 hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 transition cursor-pointer"
                      title="Delete Itinerary"
                    >
                      <FaTrashAlt className="text-sm" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Itinerary Modal/Detail Overlay */}
        {selectedTrip && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/85 backdrop-blur-sm overflow-y-auto">
            <div className="relative w-full max-w-5xl bg-[#090d16] border border-white/10 rounded-3xl p-6 md:p-8 space-y-8 shadow-2xl my-8">
              {/* Close Button */}
              <button
                onClick={() => {
                  setSelectedTrip(null);
                  setShareLink("");
                }}
                className="absolute top-6 right-6 p-2.5 rounded-full border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition cursor-pointer z-10"
              >
                <FaTimes />
              </button>

              <div>
                <span className="text-blue-400 text-xs font-semibold uppercase tracking-wider">Saved Itinerary Details</span>
                <h2 className="text-3xl font-extrabold text-white mt-1">
                  Trip to {selectedTrip.destination || selectedTrip.arrivalCity}
                </h2>
                <p className="text-sm text-gray-400 mt-2 max-w-3xl leading-relaxed">{selectedTrip.summary}</p>
              </div>

              {/* Booking Details Card - if generated from a document */}
              {selectedTrip.passengerName && selectedTrip.passengerName !== "N/A" && (
                <div className="bg-gradient-to-r from-blue-950/40 via-slate-900/60 to-indigo-955/40 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl relative overflow-hidden shadow-xl print:border-gray-300 print:bg-white print:text-black">
                  {/* Boarding pass accent stripe */}
                  <div className="absolute top-0 left-0 w-2.5 h-full bg-gradient-to-b from-blue-500 to-purple-500 print:hidden"></div>
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-6 print:border-gray-300">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-2xl print:bg-gray-100">
                        <FaTicketAlt className="text-xl" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white print:text-black">Travel Booking Details</h3>
                        <p className="text-xs text-gray-400">Extracted from your uploaded document</p>
                      </div>
                    </div>
                    {selectedTrip.pnr && selectedTrip.pnr !== "N/A" && (
                      <div className="text-right md:text-right flex flex-col md:items-end">
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider">Booking Reference (PNR)</span>
                        <span className="font-mono text-lg font-extrabold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-xl mt-1 select-all print:bg-gray-100 print:text-blue-700">
                          {selectedTrip.pnr}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                    {selectedTrip.passengerName && (
                      <div>
                        <span className="text-xs text-gray-400 block uppercase tracking-wider">Passenger</span>
                        <span className="font-bold text-white mt-1 block print:text-black">{selectedTrip.passengerName}</span>
                      </div>
                    )}
                    {(selectedTrip.airline || selectedTrip.flightNumber) && (
                      <div>
                        <span className="text-xs text-gray-400 block uppercase tracking-wider">Flight / Carrier</span>
                        <span className="font-bold text-white mt-1 block print:text-black">
                          {selectedTrip.airline && selectedTrip.airline !== "N/A" ? selectedTrip.airline : ""} 
                          {selectedTrip.flightNumber && selectedTrip.flightNumber !== "N/A" ? ` (${selectedTrip.flightNumber})` : ""}
                        </span>
                      </div>
                    )}
                    {selectedTrip.seat && selectedTrip.seat !== "N/A" && (
                      <div>
                        <span className="text-xs text-gray-400 block uppercase tracking-wider">Seat Number</span>
                        <span className="font-bold text-white mt-1 block print:text-black">{selectedTrip.seat}</span>
                      </div>
                    )}
                    {selectedTrip.departureDate && selectedTrip.departureDate !== "N/A" && (
                      <div>
                        <span className="text-xs text-gray-400 block uppercase tracking-wider">Departure Date</span>
                        <span className="font-bold text-white mt-1 block print:text-black">{selectedTrip.departureDate}</span>
                      </div>
                    )}
                  </div>

                  {(selectedTrip.departureCity || selectedTrip.arrivalCity) && (
                    <div className="mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm print:border-gray-300">
                      <div className="flex-1">
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Origin</span>
                        <span className="text-base font-bold text-white mt-1 block print:text-black">{selectedTrip.departureCity || "Home"}</span>
                        {selectedTrip.departureTime && selectedTrip.departureTime !== "N/A" && (
                          <span className="text-xs text-gray-400 mt-0.5 block">{selectedTrip.departureTime}</span>
                        )}
                      </div>
                      <div className="flex items-center justify-center px-4 py-2 text-gray-500">
                        <div className="h-0.5 w-12 bg-white/10 relative print:bg-gray-300">
                          <FaPlane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45 text-blue-500 text-sm print:text-blue-700" />
                        </div>
                      </div>
                      <div className="flex-1 sm:text-right">
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Destination</span>
                        <span className="text-base font-bold text-white mt-1 block print:text-black">{selectedTrip.arrivalCity || selectedTrip.destination}</span>
                        {selectedTrip.arrivalTime && selectedTrip.arrivalTime !== "N/A" && (
                          <span className="text-xs text-gray-400 mt-0.5 block">{selectedTrip.arrivalTime}</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Share link inside modal if copied */}
              {shareLink && (
                <div className="bg-blue-950/20 border border-blue-500/30 rounded-2xl p-4 flex items-center justify-between gap-4 text-sm animate-fade-in">
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

              {/* Detail Parameters Card Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400">
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase block">Destination</span>
                    <span className="font-bold">{selectedTrip.destination || selectedTrip.arrivalCity}</span>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-purple-600/10 border border-purple-500/20 text-purple-400">
                    <FaCalendarAlt />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase block">Duration</span>
                    <span className="font-bold">{selectedTrip.durationDays || selectedTrip.itinerary?.length || 1} Days</span>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-cyan-600/10 border border-cyan-500/20 text-cyan-400">
                    <FaUser />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase block">Travelers</span>
                    <span className="font-bold">{selectedTrip.travelersCount || 1} Person(s)</span>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-yellow-600/10 border border-yellow-500/20 text-yellow-400">
                    <FaWallet />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase block">Estimated Budget</span>
                    <span className="font-bold">
                      {selectedTrip.budgetBreakdown?.total ? formatCurrency(selectedTrip.budgetBreakdown.total) : (selectedTrip.budgetLevel || "Medium")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Layout Content Grid */}
              <div className="grid md:grid-cols-3 gap-6 items-start">
                
                {/* Left Column: Timeline */}
                <div className="md:col-span-2 space-y-6">
                  <h4 className="text-xl font-bold border-b border-white/10 pb-2">Timeline</h4>
                  
                  {selectedTrip.itinerary && selectedTrip.itinerary.length > 0 ? (
                    selectedTrip.itinerary.map((day, idx) => (
                      <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-md">
                        {/* Day Header - Sleek Text without Image */}
                        <div className="bg-gradient-to-r from-blue-600/20 via-purple-600/10 to-transparent p-4 border-b border-white/10 flex items-center justify-between">
                          <h5 className="text-lg font-extrabold text-white flex items-center gap-2">
                            <span className="text-blue-400">Day {day.dayNumber || idx + 1}</span>
                          </h5>
                        </div>

                        <div className="p-5 space-y-4">
                          {/* Morning */}
                          {day.morning && (
                            <div className="space-y-1">
                              <span className="text-xs text-blue-400 font-bold uppercase block">🌅 Morning: {day.morning.title}</span>
                              <ul className="pl-4 space-y-1 text-xs text-gray-300">
                                {day.morning.activities?.map((act, aIdx) => (
                                  <li key={aIdx} className="list-disc">{act}</li>
                                ))}
                                {day.morning.food && (
                                  <li className="list-disc">Food: {day.morning.food}</li>
                                )}
                              </ul>
                            </div>
                          )}

                          {/* Afternoon */}
                          {day.afternoon && (
                            <div className="space-y-1 pt-2 border-t border-white/5">
                              <span className="text-xs text-purple-400 font-bold uppercase block">🍛 Afternoon: {day.afternoon.title}</span>
                              <ul className="pl-4 space-y-1 text-xs text-gray-300">
                                {day.afternoon.activities?.map((act, aIdx) => (
                                  <li key={aIdx} className="list-disc">{act}</li>
                                ))}
                                {day.afternoon.food && (
                                  <li className="list-disc">Food: {day.afternoon.food}</li>
                                )}
                              </ul>
                            </div>
                          )}

                          {/* Evening */}
                          {day.evening && (
                            <div className="space-y-1 pt-2 border-t border-white/5">
                              <span className="text-xs text-cyan-400 font-bold uppercase block">🌇 Evening: {day.evening.title}</span>
                              <ul className="pl-4 space-y-1 text-xs text-gray-300">
                                {day.evening.activities?.map((act, aIdx) => (
                                  <li key={aIdx} className="list-disc">{act}</li>
                                ))}
                                {day.evening.food && (
                                  <li className="list-disc">Food: {day.evening.food}</li>
                                )}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm">No timeline segments extracted.</p>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Budget breakdown */}
                  {selectedTrip.budgetBreakdown && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-xs space-y-3">
                      <h4 className="text-sm font-bold flex items-center gap-2 mb-1">
                        <FaWallet className="text-purple-400" /> Budget Breakdown
                      </h4>
                      
                      <div className="flex justify-between">
                        <span>🏨 Hotel</span>
                        <span className="font-semibold">{formatCurrency(selectedTrip.budgetBreakdown.hotel)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>🍔 Food</span>
                        <span className="font-semibold">{formatCurrency(selectedTrip.budgetBreakdown.food)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>🚕 Transport</span>
                        <span className="font-semibold">{formatCurrency(selectedTrip.budgetBreakdown.transport)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>🎡 Activities</span>
                        <span className="font-semibold">{formatCurrency(selectedTrip.budgetBreakdown.activities)}</span>
                      </div>
                      
                      <div className="pt-2.5 border-t border-white/10 flex justify-between items-center text-sm font-bold">
                        <span>Total:</span>
                        <span className="text-blue-400">{formatCurrency(selectedTrip.budgetBreakdown.total)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-gray-300 font-semibold transition cursor-pointer text-xs"
                >
                  <FaPrint /> Print
                </button>
                <button
                  onClick={(e) => handleShare(selectedTrip._id, e)}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold hover:scale-105 active:scale-95 duration-200 cursor-pointer shadow-lg shadow-blue-500/20 text-xs"
                >
                  <FaShareAlt /> Share
                </button>
                <button
                  onClick={() => {
                    setSelectedTrip(null);
                    setShareLink("");
                  }}
                  className="px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-gray-300 font-medium text-xs transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;