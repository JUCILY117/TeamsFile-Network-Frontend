import React, { useState, useEffect } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { FaArrowLeft, FaBell } from "react-icons/fa";
import axios from "axios";
import TeamDetails from "./TeamDetails";
import { useNavigate } from "react-router-dom";
import Notifications from "./Notifications"; // Import the Notifications component

const apiBaseUrl = import.meta.env.VITE_BASE_API;

const HomeContent = () => {
  const [teams, setTeams] = useState([]);
  const [newTeamName, setNewTeamName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false); // Track if there are unread notifications
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch teams, user data, and notifications
    const fetchTeams = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/teams`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setTeams(response.data);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/auth/user`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setCurrentUser(response.data);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/notifications`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const unreadNotifications = response.data.filter((notif) => !notif.read);
        setHasUnreadNotifications(unreadNotifications.length > 0);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchTeams();
    fetchCurrentUser();
    fetchNotifications(); // Fetch notifications when component mounts
  }, []); // No need for socket now

  // This function updates the unread notification state after closing the notifications modal
  const updateUnreadNotificationsStatus = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/notifications`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const unreadNotifications = response.data.filter((notif) => !notif.read);
      setHasUnreadNotifications(unreadNotifications.length > 0);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleAddTeam = async () => {
    if (newTeamName) {
      try {
        const response = await axios.post(
          `${apiBaseUrl}/api/teams`,
          { name: newTeamName },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setTeams([...teams, response.data]);
        setNewTeamName("");
        setIsModalOpen(false);
      } catch (error) {
        console.error("Error creating team:", error);
      }
    }
  };

  const handleTeamClick = (team, event) => {
    if (event.target === event.currentTarget) {
      navigate(`/team/${team.uuid}`);
    }
  };

  const handleBackClick = () => {
    setSelectedTeam(null);
  };

  const handleNotificationClick = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    setHasUnreadNotifications(false); // Mark as read when the user views notifications
  };

  const handleMarkNotificationAsRead = (id) => {
    // Optionally update the backend when marking a notification as read
    // For now, we just set the read flag in the local state
  };

  return (
    <div className="p-6 bg-black border border-[#2c2c2c] text-white min-h-screen flex flex-col items-center">
      {selectedTeam ? (
        <TeamDetails team={selectedTeam} onBackClick={handleBackClick} />
      ) : (
        <>
          <div className="flex items-center justify-between w-full mt-4 mb-10">
            <div className="text-6xl font-bold text-center flex-1">
              {currentUser
                ? `Welcome back, ${currentUser.firstName} ${currentUser.lastName}!`
                : "Welcome, User!"}
            </div>
            <div className="flex items-center">
              {/* Notification Button */}
              <div
                className={`p-2 rounded-full cursor-pointer flex items-center justify-center mr-4 ${
    hasUnreadNotifications ? "bg-red-600" : "bg-white"
  } hover:bg-gray-200`} // Bell icon background color changes to red if unread notifications
                onClick={handleNotificationClick}
                style={{ width: "40px", height: "40px" }}
              >
                <FaBell className="text-black text-2xl" />
              </div>

              {/* Create Team Button */}
              <div
                className="bg-white hover:bg-gray-200 p-2 rounded-full cursor-pointer flex items-center justify-center"
                style={{ width: "40px", height: "40px" }}
                onClick={() => setIsModalOpen(true)}
              >
                <AiOutlinePlus className="text-black text-2xl" />
              </div>
            </div>
          </div>

          <div
            id="teamContainer"
            className={`mt-4 bg-black border border-[#2c2c2c]  p-6 rounded-lg shadow-lg min-h-[80vh] w-full ${
              teams.length === 0 ? "flex justify-center items-center" : ""
            }`}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setIsModalOpen(true);
              }
            }}
          >
            {teams.length === 0 ? (
              <p className="text-gray-200 text-3xl text-center w-full">
                Click here to create your first team!
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-4 w-full items-start">
                {teams.map((team) => (
                  <div
                    key={team._id}
                    className="bg-black border border-[#2c2c2c]  p-4 rounded-lg shadow-md text-center flex flex-col items-center justify-center transition duration-300 transform hover:scale-105 hover:bg-white hover:text-black cursor-pointer"
                    style={{ minWidth: "150px", maxWidth: "200px", minHeight: "150px", maxHeight: "200px" }}
                    onClick={(e) => handleTeamClick(team, e)}
                  >
                    <h3 className="text-lg font-semibold">{team.name}</h3>
                    <p className="text-sm mt-2">{team.members?.length || 0} members</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Modal */}
          {isNotificationsOpen && (
            <Notifications
              onClose={() => {
                setIsNotificationsOpen(false);
                updateUnreadNotificationsStatus(); // Update the unread notification status when modal is closed
              }}
              onRead={handleMarkNotificationAsRead}
            />
          )}

          {/* Modal for Creating a New Team */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center animate-fade-in">
              <div className="bg-black border border-[#2c2c2c]  p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-6">Create a New Team</h2>
                <input
                  type="text"
                  className="w-full p-2 rounded bg-black border border-[#2c2c2c]  text-white mb-4"
                  placeholder="Team Name"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                />
                <div className="flex justify-end space-x-4 mt-2">
                  <button
                    className="hover:bg-[#27272A] px-4 py-2 rounded text-white bg-none"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-white px-4 py-2 rounded text-black hover:bg-gray-200"
                    onClick={handleAddTeam}
                  >
                    Create Team
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HomeContent;
