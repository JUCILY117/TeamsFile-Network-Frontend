import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrashAlt, FaEye, FaBell } from "react-icons/fa";
import { MdOutlineDone } from "react-icons/md";

const apiBaseUrl = import.meta.env.VITE_BASE_API;

const Notifications = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/notifications`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setNotifications(response.data);

        // Count unread notifications
        const unread = response.data.filter((notif) => !notif.read).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  // Handle deleting a notification
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

  // Handle marking notification as read
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

      // Update the local state to reflect the "read" status
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif._id === id ? { ...notif, read: true } : notif
        )
      );

      // Decrease unread count
      setUnreadCount((prevCount) => prevCount - 1);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Handle accepting a team invite
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
      // Remove the notification after accepting
      setNotifications(notifications.filter((notif) => notif._id !== id));
    } catch (error) {
      console.error("Error accepting invite:", error);
    }
  };

  // Handle rejecting a team invite
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
      // Remove the notification after rejecting
      setNotifications(notifications.filter((notif) => notif._id !== id));
    } catch (error) {
      console.error("Error rejecting invite:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center animate-fade-in">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-[600px]">
        <h2 className="text-2xl font-bold mb-6 text-gray-200 flex items-center justify-between">
          <span>Notifications</span>
          <div className="relative cursor-pointer">
            <FaBell size={30} className={`text-gray-400 ${unreadCount > 0 ? "text-red-500" : ""}`} />
            {unreadCount > 0 && (
              <span
                className="absolute text-sm text-white bg-red-500 rounded-full w-5 h-5 flex items-center justify-center"
                style={{ top: '-8px', right: '-10px' }} // Adjust these values as needed
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
                  notif.read ? "bg-gray-700" : "bg-gray-600"
                } p-4 rounded-lg transition-transform transform hover:scale-105`}
              >
                <span className="text-gray-300 text-lg">{notif.message}</span>
                <div className="flex items-center space-x-3">
                  {/* Only show accept/reject buttons for invite notifications */}
                  {notif.type === 'team_invite' && (
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleAcceptInvite(notif._id, notif.teamId)}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-150"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleRejectInvite(notif._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-150"
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {/* Mark as read button */}
                  {!notif.read && (
                    <button
                      onClick={() => handleMarkAsRead(notif._id)}
                      className="text-blue-200 hover:text-green-400 transition duration-150"
                      title="Mark as read"
                    >
                      <MdOutlineDone size={25} />
                    </button>
                  )}

                  {/* Delete button */}
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
          className="mt-6 bg-gray-700 px-5 py-3 rounded-lg text-white hover:bg-gray-600 w-full font-semibold text-lg transition duration-150"
          onClick={onClose} // Close the modal when clicked
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Notifications;
