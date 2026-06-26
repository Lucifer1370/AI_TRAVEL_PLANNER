import { useEffect, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import {
  FaPlane, FaCalendarAlt, FaMapMarkerAlt, FaTrashAlt, FaShareAlt,
  FaPlaneDeparture, FaClock, FaUser, FaTicketAlt, FaTimes,
  FaCopy, FaWallet, FaPrint, FaTrain, FaBus
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
      if (selectedTrip?._id === id) setSelectedTrip(null);
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
      <div className="absolute top-20 left-10 h-96 w-96 rounded-full bg-blue-600/10 blur-[150px] -z-10"></div>
      <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-purple-600/10 blur-[150px] -z-10"></div>

      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-extrabold text-white">Your Travel History</h1>
          <p className="text-gray-400 mt-2">View, share, or manage your previously generated itineraries.</p>
        </div>

        {trips.length === 0 ? (
          <div className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl space-y-6">
            <FaPlaneDeparture className="text-gray-600 text-6xl mx-auto" />
            <h3 className="text-2xl font-bold text-white">No Trips Found</h3>
            <p className="text-gray-400 max-w-sm mx-auto">
              You haven't generated any travel itineraries yet. Head over to the Dashboard!
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip) => (
              <TripCard 
                key={trip._id} 
                trip={trip} 
                onSelect={() => setSelectedTrip(trip)} 
                onDelete={(e) => handleDelete(trip._id, e)} 
                onShare={(e) => handleShare(trip._id, e)} 
              />
            ))}
          </div>
        )}

        {selectedTrip && (
          <TripModal 
            trip={selectedTrip} 
            onClose={() => { setSelectedTrip(null); setShareLink(""); }} 
            shareLink={shareLink} 
            onShare={(e) => handleShare(selectedTrip._id, e)} 
          />
        )}
      </div>
    </div>
  );
};

const formatCurrency = (val) => {
  if (!val) return "₹0";
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val);
};

const TripCard = ({ trip, onSelect, onDelete, onShare }) => {
  return (
    <div onClick={onSelect} className="group relative rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition hover:-translate-y-1 hover:border-blue-500/40 hover:bg-white/10 cursor-pointer flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start gap-4 mb-4">
          <h3 className="text-xl font-bold text-white leading-snug truncate max-w-[80%]">
            {trip.destination || trip.arrivalCity || "Saved Route"}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-full shrink-0">
            <FaPlane className="rotate-45" /> Active
          </div>
        </div>

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

      <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
        <span className="text-xs text-gray-500 flex items-center gap-1">
          <FaClock /> {new Date(trip.createdAt).toLocaleDateString()}
        </span>
        <div className="flex items-center gap-2">
          <button onClick={onShare} className="p-2.5 rounded-xl border border-white/10 text-gray-300 hover:border-blue-500/50 hover:bg-blue-500/10 transition">
            <FaShareAlt className="text-sm" />
          </button>
          <button onClick={onDelete} className="p-2.5 rounded-xl border border-white/10 text-gray-300 hover:border-red-500/50 hover:bg-red-500/10 transition">
            <FaTrashAlt className="text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
};

const TripModal = ({ trip, onClose, shareLink, onShare }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#090d16] border border-white/10 rounded-3xl p-6 md:p-8 space-y-8 shadow-2xl my-8">
        <button onClick={onClose} className="absolute top-6 right-6 p-2.5 rounded-full border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition z-10">
          <FaTimes />
        </button>

        <div>
          <span className="text-blue-400 text-xs font-semibold uppercase tracking-wider">Saved Itinerary Details</span>
          <h2 className="text-3xl font-extrabold text-white mt-1">Trip to {trip.destination || trip.arrivalCity}</h2>
          <p className="text-sm text-gray-400 mt-2 max-w-3xl leading-relaxed">{trip.summary}</p>
        </div>

        {trip.passengerName && trip.passengerName !== "N/A" && (
          <div className="bg-gradient-to-r from-blue-950/40 via-slate-900/60 border border-white/10 rounded-3xl p-6 relative overflow-hidden shadow-xl">
            <div className="flex justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <FaTicketAlt className="text-xl text-blue-400" />
                <h3 className="text-lg font-bold">Travel Booking Details</h3>
              </div>
              {trip.pnr && trip.pnr !== "N/A" && (
                <span className="font-mono text-lg font-extrabold text-blue-400">{trip.pnr}</span>
              )}
            </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                  {trip.passengerName && (<div><span className="text-xs text-gray-400 block">Passenger</span><span className="font-bold block mt-1">{trip.passengerName}</span></div>)}
                  {(trip.airline || trip.flightNumber) && (<div><span className="text-xs text-gray-400 block">{trip.transportType === "Train" ? "Train / Carrier" : trip.transportType === "Bus" ? "Bus / Carrier" : "Flight / Carrier"}</span><span className="font-bold block mt-1">{trip.airline} {trip.flightNumber}</span></div>)}
                  {trip.seat && trip.seat !== "N/A" && (<div><span className="text-xs text-gray-400 block">Seat</span><span className="font-bold block mt-1">{trip.seat}</span></div>)}
                  {trip.departureDate && trip.departureDate !== "N/A" && (<div><span className="text-xs text-gray-400 block">Date</span><span className="font-bold block mt-1">{trip.departureDate}</span></div>)}
                </div>
          </div>
        )}

        {shareLink && (
          <div className="bg-blue-950/20 border border-blue-500/30 rounded-2xl p-4 flex justify-between gap-4">
            <span className="text-blue-300 truncate">{shareLink}</span>
            <button onClick={() => { navigator.clipboard.writeText(shareLink); toast.success("Copied!"); }} className="flex gap-1 text-blue-400 cursor-pointer">
              <FaCopy /> Copy
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <span className="text-gray-400 text-xs block">Destination</span>
            <span className="font-bold">{trip.destination || trip.arrivalCity}</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <span className="text-gray-400 text-xs block">Duration</span>
            <span className="font-bold">{trip.durationDays || trip.itinerary?.length || 1} Days</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <span className="text-gray-400 text-xs block">Travelers</span>
            <span className="font-bold">{trip.travelersCount || 1} Person(s)</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <span className="text-gray-400 text-xs block">Budget</span>
            <span className="font-bold">{trip.budgetBreakdown?.total ? formatCurrency(trip.budgetBreakdown.total) : trip.budgetLevel || "Medium"}</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 items-start">
          <div className="md:col-span-2 space-y-6">
            <h4 className="text-xl font-bold border-b border-white/10 pb-2">Timeline</h4>
            {trip.itinerary?.map((day, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="bg-blue-600/10 p-4 border-b border-white/10">
                  <h5 className="text-lg font-bold text-blue-400">Day {day.dayNumber || idx + 1}</h5>
                </div>
                <div className="p-5 space-y-4">
                  {day.morning && (
                    <div className="space-y-1"><span className="text-blue-400 font-bold block text-sm">Morning: {day.morning.title}</span><p className="text-gray-300 text-xs">{Array.isArray(day.morning.activities) ? day.morning.activities.join(", ") : day.morning.activities}</p></div>
                  )}
                  {day.afternoon && (
                    <div className="space-y-1"><span className="text-purple-400 font-bold block text-sm">Afternoon: {day.afternoon.title}</span><p className="text-gray-300 text-xs">{Array.isArray(day.afternoon.activities) ? day.afternoon.activities.join(", ") : day.afternoon.activities}</p></div>
                  )}
                  {day.evening && (
                    <div className="space-y-1"><span className="text-cyan-400 font-bold block text-sm">Evening: {day.evening.title}</span><p className="text-gray-300 text-xs">{Array.isArray(day.evening.activities) ? day.evening.activities.join(", ") : day.evening.activities}</p></div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            {trip.budgetBreakdown && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-xs space-y-3">
                <h4 className="font-bold text-sm mb-1">Budget Breakdown</h4>
                <div className="flex justify-between"><span>Hotel</span><span>{formatCurrency(trip.budgetBreakdown.hotel)}</span></div>
                <div className="flex justify-between"><span>Food</span><span>{formatCurrency(trip.budgetBreakdown.food)}</span></div>
                <div className="flex justify-between"><span>Transport</span><span>{formatCurrency(trip.budgetBreakdown.transport)}</span></div>
                <div className="flex justify-between"><span>Activities</span><span>{formatCurrency(trip.budgetBreakdown.activities)}</span></div>
                <div className="pt-2 flex justify-between border-t border-white/10 font-bold text-blue-400">
                  <span>Total</span><span>{formatCurrency(trip.budgetBreakdown.total)}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
          <button onClick={() => window.print()} className="px-4 py-2 bg-gray-800 rounded-xl text-xs">Print</button>
          <button onClick={onShare} className="px-5 py-2 bg-blue-600 rounded-xl font-bold text-xs">Share</button>
          <button onClick={onClose} className="px-5 py-2 border border-white/10 rounded-xl text-xs">Close</button>
        </div>
      </div>
    </div>
  );
};

export default History;