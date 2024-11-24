import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import FileUpload from "./FileUpload";
import Chat from "./Chat";
import { FaUser } from "react-icons/fa";
import { MdKeyboardArrowLeft } from "react-icons/md";
import InviteMember from "./InviteMember";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const apiBaseUrl = import.meta.env.VITE_BASE_API;
const socketServerUrl = import.meta.env.VITE_SOCKET_SERVER_URL;

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
      toast.error("Error sending message!"); 
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
      toast.success("Invitation sent successfully!");
    } catch (error) {
      setInviteStatus("Error sending invitation. Please try again.");
      toast.error("Error sending invitation!");
    }
  };

  return (
    <div className="p-6 bg-[#000000] text-white min-h-screen max-h-screen flex flex-col gap-6">
      {/* {error && <p className="text-red-500">{error}</p>} */}
      {team ? (
        <div className="flex flex-row gap-6">
          <div className="flex flex-col bg-black border border-[#2c2c2c] p-4 rounded-lg shadow-lg select-none">
          <div className='flex flex-row items-center gap-4'>
                <button onClick={() => navigate("/home")} className="text-white">
                  <MdKeyboardArrowLeft size={50} />
                </button>

                <div
                  className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-400 flex items-center justify-center bg-[#242424]"
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
                <h1 className="text-5xl font-bold">{team.name}</h1>
              </div>

            <div className="bg-black border border-[#2c2c2c] p-4 rounded-lg m-6">
              <div className="flex gap-[24rem]">
                <h2 className="text-xl font-semibold mb-4">Team Members</h2>
                <h3 className="text-white flex gap-2"><FaUser className="mt-1" />{team.members.length}</h3>
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

            <FileUpload
              files={files}
              setFiles={setFiles}
              isUploading={isUploading}
              uploadFile={uploadFile}
              setUploadFile={setUploadFile}
            />
          </div>

          <Chat
            chatMessages={chatMessages}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            handleSendMessage={handleSendMessage}
            noToast={true}
          />
        </div>
      ) : (
        <p>Loading team details...</p>
      )}

      <InviteMember
        inviteEmail={inviteEmail}
        setInviteEmail={setInviteEmail}
        inviteStatus={inviteStatus}
        handleInviteUser={handleInviteUser}
      />

<ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        style={{ zIndex: 9999 }}
      />
    </div>
  );
};

export default TeamDetails;
