import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import { FaUser, FaEnvelope, FaCalendarAlt, FaPlaneDeparture, FaSignOutAlt } from "react-icons/fa";

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const [tripCount, setTripCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await API.get("/itinerary/history");
        setTripCount(response.data.count || 0);
      } catch (error) {
        console.error("Failed to fetch trip count", error);
      }
    };
    if (user) {
      fetchStats();
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#030712] text-white px-6 py-16 relative overflow-hidden">
      {}
      <div className="absolute top-20 left-10 h-80 w-80 rounded-full bg-blue-600/10 blur-[130px] -z-10"></div>
      <div className="absolute bottom-20 right-10 h-80 w-80 rounded-full bg-purple-600/10 blur-[130px] -z-10"></div>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-10 text-center md:text-left">Account Profile</h1>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl space-y-8">
          {}
          <div className="flex items-center gap-6 pb-6 border-b border-white/10">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-xl">
              {user.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{user.name}</h2>
              <p className="text-gray-400 text-sm mt-1">Logged in via MERN authentication</p>
            </div>
          </div>

          {}
          <div className="space-y-6">
            {}
            <div className="flex items-center gap-4 text-sm">
              <div className="p-3 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400">
                <FaUser />
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider">Full Name</p>
                <p className="font-semibold text-white mt-0.5">{user.name}</p>
              </div>
            </div>

            {}
            <div className="flex items-center gap-4 text-sm">
              <div className="p-3 rounded-xl bg-purple-600/10 border border-purple-500/20 text-purple-400">
                <FaEnvelope />
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider">Email Address</p>
                <p className="font-semibold text-white mt-0.5">{user.email}</p>
              </div>
            </div>

            {}
            <div className="flex items-center gap-4 text-sm">
              <div className="p-3 rounded-xl bg-cyan-600/10 border border-cyan-500/20 text-cyan-400">
                <FaPlaneDeparture />
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider">Total Planned Trips</p>
                <p className="font-semibold text-white mt-0.5">{tripCount} Itineraries Saved</p>
              </div>
            </div>
          </div>

          {}
          <div className="pt-6 border-t border-white/10 flex justify-between items-center">
            <button
              onClick={logout}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600/20 border border-red-500/30 text-red-400 hover:bg-red-600/30 hover:border-red-500/50 font-semibold transition cursor-pointer text-sm"
            >
              <FaSignOutAlt />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;