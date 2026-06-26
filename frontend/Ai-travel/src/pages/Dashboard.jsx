import { useState, useContext, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import toast from "react-hot-toast";
import {
  FaCloudUploadAlt,
  FaFilePdf,
  FaFileImage,
  FaPlane,
  FaUser,
  FaTicketAlt,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaShareAlt,
  FaCopy,
  FaTrashAlt,
  FaSyncAlt,
  FaCloudSun,
  FaHotel,
  FaWallet,
  FaMapMarkedAlt,
  FaCheck,
  FaExclamationTriangle,
  FaPrint,
  FaTimes,
  FaTrain,
  FaBus,
} from "react-icons/fa";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState("");
  const [itinerary, setItinerary] = useState(null);
  const [shareLink, setShareLink] = useState("");
  
  const fileInputRef = useRef(null);

  // Handle Drag Events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndProcessFile(droppedFile);
    }
  };

  
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  
  const validateAndProcessFile = (selectedFile) => {
    const extension = selectedFile.name.split(".").pop().toLowerCase();
    const isPDF = selectedFile.type === "application/pdf" || extension === "pdf";
    const isImage = ["png", "jpg", "jpeg"].includes(extension) || selectedFile.type.startsWith("image/");

    if (!isPDF && !isImage) {
      toast.error("Unsupported format. Please upload a PDF or an Image (PNG, JPG).");
      return;
    }
    setFile(selectedFile);
    setShowPreferences(true);
  };

  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    days: 3,
    budget: "Medium",
    travelers: 1
  });

  const uploadAndGenerate = async () => {
    if (!file) return;
    
    setShowPreferences(false);
    setLoading(true);
    setUploadProgress(10);
    setLoadingPhase("Uploading booking document...");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("days", preferences.days);
    formData.append("budget", preferences.budget);
    formData.append("travelers", preferences.travelers);

    try {
      const response = await API.post("/upload/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(Math.min(90, Math.max(10, percentCompleted)));
          if (percentCompleted >= 90) {
            setLoadingPhase("AI is reading document & generating itinerary...");
          }
        },
      });

      setUploadProgress(100);
      setItinerary(response.data.itinerary);
      toast.success("Itinerary generated successfully!");
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Failed to process ticket. Please try again.";
      toast.error(msg);
      setFile(null);
    } finally {
      setLoading(false);
      setUploadProgress(0);
      setLoadingPhase("");
    }
  };

  // Generate Share Link
  const handleShare = async () => {
    if (!itinerary) return;
    try {
      const response = await API.post(`/itinerary/${itinerary._id}/share`);
      const link = response.data.shareLink;
      setShareLink(link);
      navigator.clipboard.writeText(link);
      toast.success("Share link copied to clipboard!");
    } catch (error) {
      toast.error("Failed to generate share link.");
    }
  };

  // Reset page
  const handleReset = () => {
    setFile(null);
    setItinerary(null);
    setShareLink("");
  };

  // Trigger Print
  const handlePrint = () => {
    window.print();
  };

  // Helper to format currency
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
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Hello,{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                {user?.name || "Traveler"}
              </span>
            </h1>
            <p className="text-gray-400 mt-4 max-w-xl mx-auto text-lg">
              Upload your flight tickets, hotel vouchers, or booking PDFs to instantly create a structured itinerary.
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
              <h3 className="text-xl font-bold text-white">{loadingPhase}</h3>
              <p className="text-sm text-gray-400 mt-2">This may take up to a minute depending on file size</p>
            </div>
            <div className="w-full bg-black/40 rounded-full h-2.5 overflow-hidden border border-white/5">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <div className="text-right text-xs text-gray-400">{uploadProgress}%</div>
          </div>
        )}

        {}
        {!itinerary && !loading && (
          <div className="max-w-2xl mx-auto">
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all duration-300 backdrop-blur-xl ${
                dragActive
                  ? "border-blue-500 bg-blue-500/5 shadow-[0_0_30px_rgba(59,130,246,0.15)]"
                  : "border-white/10 bg-white/5 hover:border-blue-500/30 hover:bg-white/10"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,image/png,image/jpeg,image/jpg"
                onChange={handleFileChange}
              />
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="p-4 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-2xl border border-white/10">
                  <FaCloudUploadAlt className="text-blue-400 text-5xl" />
                </div>
                <h3 className="text-2xl font-bold">Drag and drop your booking file</h3>
                <p className="text-sm text-gray-400 max-w-sm">
                  Supports PDF or Image files (Flight Ticket, Train Ticket, Hotel Booking, etc.)
                </p>
                <div className="pt-2 flex items-center justify-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <FaFilePdf className="text-red-400" /> PDF
                  </span>
                  <span className="flex items-center gap-1">
                    <FaFileImage className="text-green-400" /> PNG / JPG
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {showPreferences && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-[#090d16] border border-white/10 rounded-3xl p-8 space-y-6 shadow-2xl">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <h3 className="text-2xl font-bold text-white">Trip Preferences</h3>
                <button onClick={() => setShowPreferences(false)} className="text-gray-400 hover:text-white transition">
                  <FaTimes className="text-xl" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">How many days?</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={preferences.days}
                    onChange={(e) => setPreferences({ ...preferences, days: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Number of travelers?</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={preferences.travelers}
                    onChange={(e) => setPreferences({ ...preferences, travelers: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Budget Level</label>
                  <select
                    value={preferences.budget}
                    onChange={(e) => setPreferences({ ...preferences, budget: e.target.value })}
                    className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
                  >
                    <option value="Low">Low / Backpacking</option>
                    <option value="Medium">Medium / Standard</option>
                    <option value="Luxury">Luxury / Premium</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-white/10">
                <button
                  onClick={() => setShowPreferences(false)}
                  className="flex-1 px-4 py-3 border border-white/10 rounded-xl text-gray-300 font-semibold hover:bg-white/5 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={uploadAndGenerate}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white font-bold hover:scale-105 active:scale-95 transition"
                >
                  Generate Plan
                </button>
              </div>
            </div>
          </div>
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
            {itinerary.passengerName && itinerary.passengerName !== "N/A" && (
              <div className="bg-gradient-to-r from-blue-950/40 via-slate-900/60 to-indigo-955/40 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl relative overflow-hidden shadow-xl print:border-gray-300 print:bg-white print:text-black">
                {}
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
                  {itinerary.pnr && itinerary.pnr !== "N/A" && (
                    <div className="text-right md:text-right flex flex-col md:items-end">
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider">Booking Reference (PNR)</span>
                      <span className="font-mono text-lg font-extrabold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-xl mt-1 select-all print:bg-gray-100 print:text-blue-700">
                        {itinerary.pnr}
                      </span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                  {itinerary.passengerName && (
                    <div>
                      <span className="text-xs text-gray-400 block uppercase tracking-wider">Passenger</span>
                      <span className="font-bold text-white mt-1 block print:text-black">{itinerary.passengerName}</span>
                    </div>
                  )}
                  {(itinerary.airline || itinerary.flightNumber) && (
                    <div>
                      <span className="text-xs text-gray-400 block uppercase tracking-wider">
                        {itinerary.transportType === "Train" ? "Train / Carrier" : itinerary.transportType === "Bus" ? "Bus / Carrier" : "Flight / Carrier"}
                      </span>
                      <span className="font-bold text-white mt-1 block print:text-black">
                        {itinerary.airline && itinerary.airline !== "N/A" ? itinerary.airline : ""} 
                        {itinerary.flightNumber && itinerary.flightNumber !== "N/A" ? ` (${itinerary.flightNumber})` : ""}
                      </span>
                    </div>
                  )}
                  {itinerary.seat && itinerary.seat !== "N/A" && (
                    <div>
                      <span className="text-xs text-gray-400 block uppercase tracking-wider">Seat Number</span>
                      <span className="font-bold text-white mt-1 block print:text-black">{itinerary.seat}</span>
                    </div>
                  )}
                  {itinerary.departureDate && itinerary.departureDate !== "N/A" && (
                    <div>
                      <span className="text-xs text-gray-400 block uppercase tracking-wider">Departure Date</span>
                      <span className="font-bold text-white mt-1 block print:text-black">{itinerary.departureDate}</span>
                    </div>
                  )}
                </div>

                {(itinerary.departureCity || itinerary.arrivalCity) && (
                  <div className="mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm print:border-gray-300">
                    <div className="flex-1">
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Origin</span>
                      <span className="text-base font-bold text-white mt-1 block print:text-black">{itinerary.departureCity || "Home"}</span>
                      {itinerary.departureTime && itinerary.departureTime !== "N/A" && (
                        <span className="text-xs text-gray-400 mt-0.5 block">{itinerary.departureTime}</span>
                      )}
                    </div>
                    <div className="flex items-center justify-center px-4 py-2 text-gray-500">
                      <div className="h-0.5 w-12 bg-white/10 relative print:bg-gray-300">
                        {itinerary.transportType === "Train" ? (
                          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500 text-sm print:text-blue-700">🚂</span>
                        ) : itinerary.transportType === "Bus" ? (
                          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500 text-sm print:text-blue-700">🚌</span>
                        ) : (
                          <FaPlane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45 text-blue-500 text-sm print:text-blue-700" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1 sm:text-right">
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Destination</span>
                      <span className="text-base font-bold text-white mt-1 block print:text-black">{itinerary.arrivalCity || itinerary.destination}</span>
                      {itinerary.arrivalTime && itinerary.arrivalTime !== "N/A" && (
                        <span className="text-xs text-gray-400 mt-0.5 block">{itinerary.arrivalTime}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

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
                      {}
                      <div className="space-y-1.5">
                        <div className="flex justify-between font-semibold">
                          <span>🏨 Accommodation</span>
                          <span>{formatCurrency(itinerary.budgetBreakdown.hotel)}</span>
                        </div>
                        <div className="bg-black/40 h-2 rounded-full overflow-hidden print:bg-gray-200">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: "38%" }}></div>
                        </div>
                      </div>

                      {}
                      <div className="space-y-1.5">
                        <div className="flex justify-between font-semibold">
                          <span>🍔 Food & Dining</span>
                          <span>{formatCurrency(itinerary.budgetBreakdown.food)}</span>
                        </div>
                        <div className="bg-black/40 h-2 rounded-full overflow-hidden print:bg-gray-200">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: "20%" }}></div>
                        </div>
                      </div>

                      {}
                      <div className="space-y-1.5">
                        <div className="flex justify-between font-semibold">
                          <span>🚕 Transport</span>
                          <span>{formatCurrency(itinerary.budgetBreakdown.transport)}</span>
                        </div>
                        <div className="bg-black/40 h-2 rounded-full overflow-hidden print:bg-gray-200">
                          <div className="bg-cyan-500 h-2 rounded-full" style={{ width: "15%" }}></div>
                        </div>
                      </div>

                      {}
                      <div className="space-y-1.5">
                        <div className="flex justify-between font-semibold">
                          <span>🎡 Sightseeing & Activities</span>
                          <span>{formatCurrency(itinerary.budgetBreakdown.activities)}</span>
                        </div>
                        <div className="bg-black/40 h-2 rounded-full overflow-hidden print:bg-gray-200">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "27%" }}></div>
                        </div>
                      </div>

                      {}
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

export default Dashboard;