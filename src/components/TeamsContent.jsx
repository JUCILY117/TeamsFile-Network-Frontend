import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify'; // Import toast and ToastContainer
import 'react-toastify/dist/ReactToastify.css';  // Import Toastify CSS
import TeamProfileUpload from './TeamProfileUpload';

const apiBaseUrl = import.meta.env.VITE_BASE_API;

const TeamsContent = () => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [members, setMembers] = useState([]);

  // Fetch teams
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${apiBaseUrl}/api/teams`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

  // Fetch members when a team is selected
  useEffect(() => {
    const fetchMembers = async () => {
      if (selectedTeam && selectedTeam._id) {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`${apiBaseUrl}/api/teams/${selectedTeam._id}/members`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setMembers(response.data); // Update members from response
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
    console.log('Selected Team:', team);
  };

  const handleUploadSuccess = () => {
    toast.success('Image uploaded successfully');  // Show success toast
  };

  return (
    <div className="p-6 flex space-x-6 bg-gray-900 text-white min-h-screen">
      {/* Team Selection */}
      <div className="w-1/4 bg-gray-800 p-4 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Select Team</h2>
        <ul className="space-y-2">
          {teams.map((team) => (
            <li
              key={team._id}
              className={`cursor-pointer p-3 rounded-md transition-colors duration-200 ${selectedTeam?._id === team._id ? 'bg-blue-900 font-bold' : 'bg-gray-700 hover:bg-blue-400 hover:text-black font-bold'}`}
              onClick={() => handleTeamSelect(team._id)}
            >
              {team.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Team Overview and Features */}
      <div className="flex-1">
        {selectedTeam && (
          <div className="bg-gray-800 p-4 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">{selectedTeam.name} Overview</h2>
            
            {/* Profile Image Upload */}
            <TeamProfileUpload selectedTeam={selectedTeam} onUploadSuccess={handleUploadSuccess} />

            {/* Member List */}
            <div className="bg-gray-700 p-4 rounded-lg mb-6 shadow-inner h-48 overflow-y-auto">
              <h3 className="font-semibold mb-2">Team Members</h3>
              <ul className="space-y-2">
                {members.map((member) => (
                  <li key={member._id} className="flex justify-between bg-gray-600 p-3 rounded-md">
                    <span>{member.name || 'Unknown Member'}</span>
                    <span>{member.role || 'No Role'}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Role Management */}
            <div className="bg-gray-700 p-4 rounded-lg shadow-inner mb-6">
              <h3 className="font-semibold mb-4">Manage Roles</h3>
              {(selectedTeam.roles || []).map((role) => (
                <div key={role} className="flex items-center justify-between mb-4">
                  <span>{role}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add ToastContainer here */}
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop closeButton pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

export default TeamsContent;
