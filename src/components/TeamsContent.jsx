import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TeamProfileUpload from './TeamProfileUpload';
import ManageRoles from './ManageRoles';
import AssignRole from './AssignRole';
import { FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import { IoPersonRemoveSharp } from "react-icons/io5";

const apiBaseUrl = import.meta.env.VITE_BASE_API;

const TeamsContent = () => {
  const inputRef = useRef(null);
  const [cursorPos, setCursorPos] = useState(null);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [editingRoleMember, setEditingRoleMember] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');

  useEffect(() => {
    if (selectedTeam) {
      setNewTeamName(selectedTeam.name);
    }
  }, [selectedTeam]);

  const handleInput = (e) => {
    const selection = window.getSelection();
    const cursorPos = selection.focusOffset;
    setCursorPos(cursorPos);
    setNewTeamName(e.target.innerText);
  };

  useEffect(() => {
    if (inputRef.current && cursorPos !== null) {
      const selection = window.getSelection();
      const firstChild = inputRef.current.firstChild;

      if (firstChild) {
        const range = document.createRange();
        range.setStart(firstChild, cursorPos);
        range.setEnd(firstChild, cursorPos);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }, [newTeamName, cursorPos]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${apiBaseUrl}/api/teams`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTeams(Array.isArray(response.data) ? response.data : response.data.teams || []);
        if (response.data.length > 0) {
          setSelectedTeam(response.data[0]);
        }
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    fetchTeams();
  }, []);

  useEffect(() => {
    const fetchMembers = async () => {
      if (selectedTeam && selectedTeam._id) {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`${apiBaseUrl}/api/teams/${selectedTeam._id}/members`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setMembers(response.data);
        } catch (error) {
          console.error('Error fetching members:', error);
        }
      }
    };
    fetchMembers();
  }, [selectedTeam]);

  const handleTeamSelect = (teamId) => {
    const team = teams.find((t) => t._id === teamId);
    setSelectedTeam(team);
  };

  const handleUploadSuccess = () => {
    toast.success('Image uploaded successfully');
  };

  const handleEditTeamName = () => {
    setIsEditingName(true);
  };

  const handleConfirmTeamName = async () => {
    if (!newTeamName.trim()) {
      toast.error('Team name cannot be empty');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${apiBaseUrl}/api/teams/${selectedTeam._id}/name`,
        { name: newTeamName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSelectedTeam((prevTeam) => ({
        ...prevTeam,
        name: newTeamName,
      }));
      setIsEditingName(false);
      toast.success('Team name updated successfully');
    } catch (error) {
      toast.error('Failed to update team name');
    }
  };

  const handleCancelEdit = () => {
    setIsEditingName(false);
    setNewTeamName(selectedTeam.name);
  };

  const handleMemberRemoval = async (memberId) => {
    try {
        const token = localStorage.getItem('token');
        await axios.delete(`${apiBaseUrl}/api/teams/${selectedTeam._id}/members/${memberId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setMembers((prevMembers) => prevMembers.filter((member) => member._id !== memberId));

        toast.success('Member removed successfully');
    } catch (error) {
        console.error('Error removing member:', error);
        toast.error('Failed to remove member');
    }
};


  return (
    <div className="p-6 flex space-x-6 bg-black border border-[#2c2c2c] text-white min-h-screen">
      <div className="w-1/4 bg-black border border-[#2c2c2c] p-4 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Select Team</h2>
        <ul className="space-y-2">
          {teams.map((team) => (
            <li
              key={team._id}
              className={`cursor-pointer p-3 rounded-md transition-colors duration-200 ${selectedTeam?._id === team._id ? 'bg-white text-black hover:bg-gray-200 font-bold' : 'bg-gray-700 hover:bg-blue-400 hover:text-black font-bold'}`}
              onClick={() => handleTeamSelect(team._id)}
            >
              {team.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1">
        {selectedTeam && (
          <div className="bg-black border border-[#2c2c2c] p-4 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Overview</h2>
            <div className="text-5xl font-bold mb-4 flex items-center">
              {isEditingName ? (
                <>
                  <span
                    ref={inputRef}
                    contentEditable
                    suppressContentEditableWarning={true}
                    onBlur={() => setIsEditingName(false)}
                    onInput={handleInput}
                    className="border-b-2 border-gray-400 cursor-text outline-none"
                  >
                    {newTeamName}
                  </span>
                  <div className="ml-6 flex space-x-2">
                    <FaCheck onClick={handleConfirmTeamName} className="cursor-pointer text-white hover:text-green-700" size={24} />
                    <FaTimes onClick={handleCancelEdit} className="cursor-pointer text-white hover:text-red-700" size={24} />
                  </div>
                </>
              ) : (
                <>
                  {selectedTeam.name}
                  <FaEdit onClick={handleEditTeamName} className="ml-6 cursor-pointer text-white hover:text-blue-500" size={24} />
                </>
              )}
            </div>

            <TeamProfileUpload selectedTeam={selectedTeam} onUploadSuccess={handleUploadSuccess} />

              <div className="mb-6 p-4 border border-[#2c2c2c] rounded-md">
                <h3 className="text-xl font-semibold mb-4">Team Members</h3>
                <div className="overflow-y-auto max-h-[22vh]">
                  <div className="flex flex-wrap gap-6">
                    {members.length > 0 ? (
                      members.map((member) => (
                        <div key={member._id} className="flex flex-col items-start bg-black border border-[#2c2c2c] overflow-hidden p-6 rounded-md w-[31vw] transition duration-300"> 
                          <div className="flex items-center mb-6">
                            <img
                              src={member.profileImage || '/path/to/default/profile.png'}
                              alt={member.name}
                              className="w-20 h-20 rounded-full border border-[#27272A] mr-6"
                            />
                            <div className="flex flex-col">
                              <span className="font-semibold text-white text-2xl">{member.name}</span>
                              <span className="text-lg text-gray-500">{member.email || 'No Email'}</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center w-full">
                            <span className="text-xl ml-2 font-medium text-gray-400">{member.role}</span>
                            <IoPersonRemoveSharp
                              onClick={() => handleMemberRemoval(member._id)}
                              size={30}
                              className="hover:text-red-600 cursor-pointer hover:scale-[1.2] transition-all duration-300"
                            />
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>No members found</p>
                    )}
                  </div>
                </div>
              </div>

            <ManageRoles selectedTeam={selectedTeam} />
            <AssignRole selectedTeam={selectedTeam} />

            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={true} newestOnTop closeButton pauseOnFocusLoss draggable pauseOnHover theme="dark" />
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamsContent;
