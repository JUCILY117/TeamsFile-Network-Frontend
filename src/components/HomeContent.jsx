import React, { useState, useEffect } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { FaArrowLeft, FaBell } from "react-icons/fa";
import axios from "axios";
import TeamDetails from "./TeamDetails";
import { useNavigate } from "react-router-dom";
import Notifications from "./Notifications";

const apiBaseUrl = import.meta.env.VITE_BASE_API;

const HomeContent = () => {
  const [teams, setTeams] = useState([]);
  const [newTeamName, setNewTeamName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
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
    fetchNotifications();
  }, []);

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
    setHasUnreadNotifications(false);
  };

  const handleMarkNotificationAsRead = (id) => {
    //for later
  };

  return (
    <div className="p-6 bg-black border border-[#2c2c2c] text-white min-h-screen flex flex-col items-center">
      {selectedTeam ? (
        <TeamDetails team={selectedTeam} onBackClick={handleBackClick} />
      ) : (
        <>
          <div className="flex items-center justify-between w-full mt-10 mb-10">
            <div className="text-6xl font-bold text-center flex-1">
              {currentUser
                ? `Welcome back, ${currentUser.firstName} ${currentUser.lastName}!`
                : "Welcome, User!"}
            </div>
            <div className="flex items-center">
              <div
                className={`p-2 rounded-full cursor-pointer flex items-center justify-center mr-4 ${
                  hasUnreadNotifications ? "bg-red-600" : "bg-white"
                } hover:bg-gray-200`}
                onClick={handleNotificationClick}
                style={{ width: "40px", height: "40px" }}
              >
                <FaBell className="text-black text-2xl" />
              </div>
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
                    className="bg-black border border-[#2c2c2c] p-4 rounded-lg shadow-md text-center flex flex-col items-center justify-center transition duration-300 transform hover:scale-105 hover:bg-white hover:text-black cursor-pointer group"
                    style={{ minWidth: "350px", maxWidth: "200px", minHeight: "250px", maxHeight: "200px" }}
                    onClick={(e) => handleTeamClick(team, e)}
                  >
                    <div
                      className="w-24 h-24 rounded-full mb-4 overflow-hidden border-2 border-[#2c2c2c] flex items-center justify-center bg-[#242424] group-hover:border-2 group-hover:border-black transition-all duration-300"
                      style={{
                        backgroundImage: team.teamImage
                          ? `url(${team.teamImage})`
                          : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    >
                      {!team.teamImage && (
                        <span className="text-4xl font-bold text-white">
                          {team.name
                            .split(' ')
                            .map((word, index) => word[0].toUpperCase())
                            .join('')
                            .split('')
                            .map((letter, index) => (
                              <span
                                key={index}
                                className={index === 0 ? 'text-red-500' : index === 1 ? 'text-blue-500' : 'text-white'}
                              >
                                {letter}
                              </span>
                            ))}
                        </span>
                      )}
                    </div>
                    <h3 className="text-4xl font-semibold">{team.name}</h3>
                    <p className="text-lg mt-2 text-gray-300 group-hover:text-black">{team.members?.length || 0} members</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {isNotificationsOpen && (
            <Notifications
              onClose={() => {
                setIsNotificationsOpen(false);
                updateUnreadNotificationsStatus();
              }}
              onRead={handleMarkNotificationAsRead}
            />
          )}

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
