import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client"; // Import Socket.IO client
import FileUpload from "./FileUpload";
import Chat from "./Chat";
import { FaUser } from "react-icons/fa";
import { MdKeyboardArrowLeft } from "react-icons/md";
import InviteMember from "./InviteMember";

const apiBaseUrl = import.meta.env.VITE_BASE_API;
const socketServerUrl = import.meta.env.VITE_SOCKET_SERVER_URL; // Make sure this is set in your environment variables

const TeamDetails = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [files, setFiles] = useState([]);
  const [uploadFile, setUploadFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteStatus, setInviteStatus] = useState("");
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  // Initialize Socket.IO connection
  const socket = io(socketServerUrl, {
    auth: { token: localStorage.getItem("token") },
  });

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/auth/user`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setCurrentUser(response.data);
      } catch (error) {
        console.error("Error fetching current user info:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/teams/${teamId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        const teamData = response.data;
        const memberDetailsPromises = teamData.members.map((member) =>
          axios.get(`${apiBaseUrl}/api/auth/user/${member.user}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          })
        );

        const memberDetailsResponses = await Promise.all(memberDetailsPromises);
        const membersWithDetails = teamData.members.map((member, index) => {
          const userDetails = memberDetailsResponses[index].data;
          return {
            ...member,
            firstName: userDetails.firstName,
            lastName: userDetails.lastName,
            email: userDetails.email,
          };
        });

        setTeam({ ...teamData, members: membersWithDetails });
      } catch (error) {
        setError("Error fetching team details. Please try again.");
        console.error("Error fetching team details:", error);
      }
    };

    fetchTeamDetails();
  }, [teamId]);

  useEffect(() => {
    const fetchChatMessages = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/chat/${teamId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setChatMessages(response.data);
      } catch (error) {
        console.error("Error fetching chat messages:", error);
      }
    };

    fetchChatMessages();

    socket.emit("joinRoom", teamId);
    socket.on("newMessage", (message) => {
      setChatMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("newMessage");
      socket.emit("leaveRoom", teamId);
    };
  }, [teamId, socket]);

  const handleSendMessage = async () => {
    if (!newMessage) return;

    try {
      const response = await axios.post(
        `${apiBaseUrl}/api/chat`,
        { teamId, message: newMessage },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      socket.emit("sendMessage", response.data);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleInviteUser = async () => {
    if (!inviteEmail) {
      setInviteStatus("Please enter a valid email address.");
      return;
    }

    try {
      await axios.post(
        `${apiBaseUrl}/api/teams/${teamId}/members`,
        { email: inviteEmail },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setInviteStatus("Invitation sent successfully!");
      setInviteEmail("");
    } catch (error) {
      setInviteStatus("Error sending invitation. Please try again.");
    }
  };

  return (
    <div className="p-6 bg-[#000000] text-white min-h-screen flex flex-col gap-6">

      {error && <p className="text-red-500">{error}</p>}
      {team ? (
        <div className="flex flex-row gap-6">
          {/* Left side: Team Members, File Upload */}
          <div className="flex flex-col bg-black border border-[#2c2c2c] p-4 rounded-lg shadow-lg">
          <div className='flex flex-row gap-4'>
          <button onClick={() => navigate("/home")} className="text-white mt-[0.5rem]">
          <MdKeyboardArrowLeft size={50}/>
      </button>
            {/* Team Image */}
          <div
            className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-500"
            style={{
              backgroundImage: `url(${team.teamImage || '/path/to/default-image.jpg'})`, // Set team image or default
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          ></div>

          {/* {Team Name} */}
            <h1 className="text-6xl font-bold m-3">{team.name}</h1>
            </div>

            {/* Team members list */}
            <div className="bg-black border border-[#2c2c2c]  p-4 rounded-lg m-6">
              <div className="flex gap-[24rem]">
              <h2 className="text-xl font-semibold mb-4">Team Members</h2>
              <h3 className="text-white flex gap-2"><FaUser className="mt-1"/>{team.members.length}</h3>
              </div>
              <div className="max-h-48 overflow-y-auto">
                <ul className="space-y-2">
                  {team.members.map((member) => (
                    <li key={member._id} className="flex items-center justify-between">
                      <span>{member.firstName || "No First Name"} {member.lastName || "No Last Name"}</span>
                      <span className="text-gray-400 text-sm">{member.role}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* File Upload Component */}
            <FileUpload
              files={files}
              setFiles={setFiles}
              isUploading={isUploading}
              uploadFile={uploadFile}
              setUploadFile={setUploadFile}
            />
          </div>

          {/* Right side: Chat */}
            <Chat
              chatMessages={chatMessages}
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              handleSendMessage={handleSendMessage}
            />
          </div>
      ) : (
        <p>Loading team details...</p>
      )}

      {/* Invite Member Section - Takes full width */}
        <InviteMember
          inviteEmail={inviteEmail}
          setInviteEmail={setInviteEmail}
          inviteStatus={inviteStatus}
          handleInviteUser={handleInviteUser}
        />
      </div>
  );
};

export default TeamDetails;
