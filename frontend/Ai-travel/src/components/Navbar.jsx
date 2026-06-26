import { useState, useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaPlaneDeparture, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const { user, token, logout } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Helper to get initials
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-black/70 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" onClick={closeMobileMenu} className="flex items-center gap-2 text-2xl font-bold text-white">
          <FaPlaneDeparture className="text-blue-500 text-3xl" />
          <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent">
            AI Travel
          </span>
        </Link>

        {/* Desktop Navigation Menu */}
        <div className="hidden md:flex items-center gap-8 text-gray-300">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `hover:text-blue-400 duration-300 font-medium ${isActive ? "text-blue-400" : ""}`
            }
          >
            Home
          </NavLink>

          {token && (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `hover:text-blue-400 duration-300 font-medium ${isActive ? "text-blue-400" : ""}`
                }
              >
                Dashboard
              </NavLink>

              <NavLink
                to="/history"
                className={({ isActive }) =>
                  `hover:text-blue-400 duration-300 font-medium ${isActive ? "text-blue-400" : ""}`
                }
              >
                History
              </NavLink>

              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `hover:text-blue-400 duration-300 font-medium ${isActive ? "text-blue-400" : ""}`
                }
              >
                Profile
              </NavLink>
            </>
          )}
        </div>

        {/* Desktop Authentication Button/Profile */}
        <div className="hidden md:flex items-center gap-4">
          {token && user ? (
            <div className="flex items-center gap-4">
              {/* User Avatar Circle */}
              <Link to="/profile" className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg text-sm">
                  {getInitials(user.name)}
                </div>
                <span className="text-sm font-medium text-gray-300 max-w-[120px] truncate">
                  {user.name}
                </span>
              </Link>

              {/* Logout Button */}
              <button
                onClick={() => {
                  logout();
                  closeMobileMenu();
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-white/10 hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 text-sm font-medium transition cursor-pointer"
              >
                <FaSignOutAlt className="text-xs" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-5 py-2.5 rounded-xl border border-white/10 text-gray-300 font-medium hover:bg-white/5 text-sm transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:scale-105 text-sm transition"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Hamburger Icon for Mobile */}
        <div className="flex items-center md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="text-gray-300 hover:text-white focus:outline-none p-2 text-2xl transition cursor-pointer"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Collapsible Dropdown Menu */}
      <div
        className={`md:hidden bg-black/95 backdrop-blur-lg border-t border-gray-800 transition-all duration-300 ease-in-out overflow-hidden ${
          isMobileMenuOpen ? "max-h-[450px]" : "max-h-0"
        }`}
      >
        <div className="px-6 py-6 flex flex-col space-y-4 text-gray-300">
          <NavLink
            to="/"
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              `text-lg hover:text-blue-400 font-medium py-2 border-b border-white/5 block ${
                isActive ? "text-blue-400" : ""
              }`
            }
          >
            Home
          </NavLink>

          {token && (
            <>
              <NavLink
                to="/dashboard"
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `text-lg hover:text-blue-400 font-medium py-2 border-b border-white/5 block ${
                    isActive ? "text-blue-400" : ""
                  }`
                }
              >
                Dashboard
              </NavLink>

              <NavLink
                to="/history"
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `text-lg hover:text-blue-400 font-medium py-2 border-b border-white/5 block ${
                    isActive ? "text-blue-400" : ""
                  }`
                }
              >
                History
              </NavLink>

              <NavLink
                to="/profile"
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `text-lg hover:text-blue-400 font-medium py-2 border-b border-white/5 block ${
                    isActive ? "text-blue-400" : ""
                  }`
                }
              >
                Profile
              </NavLink>
            </>
          )}

          {token && user ? (
            <div className="pt-4 flex flex-col space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg text-base">
                  {getInitials(user.name)}
                </div>
                <div>
                  <p className="text-white font-bold">{user.name}</p>
                  <p className="text-gray-400 text-xs truncate max-w-[200px]">{user.email}</p>
                </div>
              </div>

              <button
                onClick={() => {
                  logout();
                  closeMobileMenu();
                }}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-white/10 hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 text-base font-semibold transition cursor-pointer"
              >
                <FaSignOutAlt className="text-sm" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="pt-4 flex flex-col space-y-3">
              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="w-full text-center py-3 rounded-xl border border-white/10 text-gray-300 font-medium hover:bg-white/5 transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={closeMobileMenu}
                className="w-full text-center py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:scale-[1.02] active:scale-[0.98] transition"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;