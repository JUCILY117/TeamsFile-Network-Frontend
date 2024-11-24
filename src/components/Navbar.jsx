import { useAuth } from "../context/AuthContext";
import { useProfile } from "../context/ProfileContext";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { profileImage } = useProfile();
  const navigate = useNavigate();
  const [showTooltip, setShowTooltip] = useState(false);
  const apiBaseUrlClient = import.meta.env.VITE_BASE_API_CLIENT;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div
      className="group fixed top-0 left-0 w-full z-50 pointer-events-none select-none"
      style={{ height: "80px" }}
    >
      <nav
        className="bg-black shadow-lg p-4 flex justify-between items-center opacity-0 group-hover:opacity-100 pointer-events-auto transition-opacity duration-300"
        style={{ height: "80px" }}
      >
        <div className="flex-shrink-0">
          <Link to="/">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-10 w-auto ml-4"
            />
          </Link>
        </div>

        <div className="flex-1 flex justify-center ml-12 space-x-12 text-lg">
          {user ? (
            <Link to="/home" className="text-white hover:text-gray-400">
              Home
            </Link>
          ) : (
            <Link to={`${apiBaseUrlClient}/pricing`} target='_blank'
            className="text-white hover:text-gray-400"
            >
              Pricing
            </Link>
          )}
          <Link
            to={`${apiBaseUrlClient}/about`}
            title="LOUD AUDIO WARNING!"
            target="_blank"
            className="text-white hover:text-gray-400"
          >
            About
          </Link>
          <Link
            to={`${apiBaseUrlClient}/support`}
            target="_blank"
            className="text-white hover:text-gray-400"
          >
            Contact
          </Link>
        </div>

        <div className="flex items-center space-x-4 mr-4">
          {user ? (
            <>
              <Link
                to={`${apiBaseUrlClient}/profile`}
                target="_blank"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="relative"
              >
                <img
                  src={profileImage}
                  alt="Profile"
                  className="h-14 w-14 rounded-full border-2 border-[#2c2c2c] hover:border-white transition duration-200"
                />
                {showTooltip && (
                  <div className="absolute left-0 top-12 bg-black w-screen text-white text-sm p-2 rounded-md shadow-md z-10">
                    View or edit your profile
                  </div>
                )}
              </Link>
              <span className="text-white font-bold text-xl">
                {user.firstName} {user.lastName}
              </span>
              <button
                onClick={handleLogout}
                className="text-white hover:text-red-600 flex items-center"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="mx-4" title="Logout"/>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-none text-white px-4 py-2 rounded hover:bg-[#27272A] transition duration-200"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-white text-black font-bold px-4 py-2 rounded hover:bg-gray-200 transition duration-200"
              >
                Signup
              </Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
