import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaEnvelope, FaLock, FaPlaneDeparture } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030712] text-white px-6 relative overflow-hidden">
      {}
      <div className="absolute top-1/4 left-1/4 h-80 w-80 rounded-full bg-blue-600/10 blur-[130px]"></div>
      <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-purple-600/10 blur-[130px]"></div>

      <div className="w-full max-w-md relative z-10">
        {}
        <div className="flex flex-col items-center mb-8">
          <Link to="/" className="flex items-center gap-2 text-3xl font-extrabold text-white">
            <FaPlaneDeparture className="text-blue-500 text-4xl animate-bounce" />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent">
              AI Travel
            </span>
          </Link>
          <p className="text-gray-400 mt-2 text-sm text-center">Your ultimate AI-powered travel planner</p>
        </div>

        {}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
          <h2 className="text-2xl font-bold text-center mb-6">Welcome Back</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {}
            <div>
              <label className="text-sm font-semibold text-gray-300 block mb-2">Email Address</label>
              <div className="flex items-center rounded-xl border border-white/10 bg-black/40 px-4 focus-within:border-blue-500/50 transition">
                <FaEnvelope className="text-blue-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-transparent p-4 outline-none text-white text-sm"
                  required
                />
              </div>
            </div>

            {}
            <div>
              <label className="text-sm font-semibold text-gray-300 block mb-2">Password</label>
              <div className="flex items-center rounded-xl border border-white/10 bg-black/40 px-4 focus-within:border-purple-500/50 transition">
                <FaLock className="text-purple-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent p-4 outline-none text-white text-sm"
                  required
                />
              </div>
            </div>

            {}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-4 font-semibold text-white hover:scale-[1.02] active:scale-[0.98] duration-300 flex justify-center items-center gap-2 cursor-pointer shadow-lg shadow-blue-500/20 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {}
          <p className="mt-8 text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-400 hover:text-blue-300 font-semibold transition">
              Create an Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;