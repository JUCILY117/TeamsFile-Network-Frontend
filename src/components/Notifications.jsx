import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrashAlt, FaEye, FaBell } from "react-icons/fa";
import { MdOutlineDone } from "react-icons/md";

const apiBaseUrl = import.meta.env.VITE_BASE_API;

const Notifications = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/notifications`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setNotifications(response.data);
        const unread = response.data.filter((notif) => !notif.read).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  const handleDeleteNotification = async (id) => {
    try {
      await axios.delete(`${apiBaseUrl}/api/notifications/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setNotifications(notifications.filter((notif) => notif._id !== id));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await axios.patch(
        `${apiBaseUrl}/api/notifications/${id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif._id === id ? { ...notif, read: true } : notif
        )
      );

      setUnreadCount((prevCount) => prevCount - 1);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleAcceptInvite = async (id, teamId) => {
    try {
      await axios.post(
        `${apiBaseUrl}/api/notifications/accept-invite`,
        { teamId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setNotifications(notifications.filter((notif) => notif._id !== id));
    } catch (error) {
      console.error("Error accepting invite:", error);
    }
  };

  const handleRejectInvite = async (id) => {
    try {
      await axios.post(
        `${apiBaseUrl}/api/notifications/reject-invite`,
        { notificationId: id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setNotifications(notifications.filter((notif) => notif._id !== id));
    } catch (error) {
      console.error("Error rejecting invite:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center animate-fade-in">
      <div className="bg-black border border-[#2c2c2c] p-8 rounded-lg  w-[600px]">
        <h2 className="text-2xl font-bold mb-6 text-gray-200 flex items-center justify-between">
          <span>Notifications</span>
          <div className="relative cursor-pointer">
            <FaBell size={30} className={`text-white ${unreadCount > 0 ? "text-red-500" : ""}`} />
            {unreadCount > 0 && (
              <span
                className="absolute text-sm text-white bg-red-500 rounded-full w-5 h-5 flex items-center justify-center"
                style={{ top: '-8px', right: '-10px' }}
              >
                {unreadCount}
              </span>
            )}
          </div>
        </h2>

        <ul className="space-y-4">
          {notifications.length === 0 ? (
            <li className="text-gray-400 text-lg text-center">You have no notifications</li>
          ) : (
            notifications.map((notif) => (
              <li
                key={notif._id}
                className={`flex justify-between items-center ${
                  notif.read ? "bg-black border border-[#2c2c2c]" : "bg-black border border-[#2c2c2c]"
                } p-4 rounded-lg transition-transform transform hover:scale-105`}
              >
                <span className="text-gray-300 text-lg">{notif.message}</span>
                <div className="flex items-center space-x-3">
                  {notif.type === 'team_invite' && (
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleAcceptInvite(notif._id, notif.teamId)}
                        className="bg-white text-black font-bold px-4 py-2 rounded-lg hover:bg-gray-200 transition duration-150"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleRejectInvite(notif._id)}
                        className="bg-none text-white px-4 py-2 rounded-lg hover:bg-[#27272A] transition duration-150"
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {!notif.read && (
                    <button
                      onClick={() => handleMarkAsRead(notif._id)}
                      className="text-white hover:text-green-400 transition duration-150"
                      title="Mark as read"
                    >
                      <MdOutlineDone size={25} />
                    </button>
                  )}

                  <button
                    onClick={() => handleDeleteNotification(notif._id)}
                    className="text-red-500 hover:text-red-700 transition duration-150"
                    title="Delete notification"
                  >
                    <FaTrashAlt size={20} />
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>

        <button
          className="mt-6 bg-white px-5 py-3 rounded-lg text-black hover:bg-gray-200 w-full font-semibold text-lg transition duration-150"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Notifications;
