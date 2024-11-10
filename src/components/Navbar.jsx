import { useAuth } from "../context/AuthContext";
import { useProfile } from '../context/ProfileContext';
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
    <nav className="bg-black shadow-lg p-4 flex justify-between items-center relative">
      <div className="flex items-center">
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
            className="h-12 w-12 rounded-full mr-3 border-4 border-transparent hover:border-white hover:scale-110 transition duration-200"
          />
          {showTooltip && (
            <div className="absolute border-2 border-[#2c2c2c]  left-0 top-12 bg-black text-white text-md p-4 rounded-md shadow-lg min-w-96 z-10">
              This will redirect you to your profile setup. You can update your details from there.
            </div>
          )}
        </Link>
        <span className="text-white text-lg font-semibold">{user?.firstName} {user?.lastName}</span>
      </div>
      <button
        onClick={handleLogout}
        className="text-white flex items-center hover:text-gray-400 transition duration-200"
      >
        <FontAwesomeIcon icon={faSignOutAlt} className="mr-1" />
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
