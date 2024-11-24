import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUserCog } from "react-icons/fa";

const apiBaseUrl = import.meta.env.VITE_BASE_API;

const ManageRoles = ({ selectedTeam }) => {
  const [roles, setRoles] = useState([]);
  const [newRole, setNewRole] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      if (selectedTeam && selectedTeam._id) {
        try {
          const token = localStorage.getItem('token');
          const rolesResponse = await axios.get(`${apiBaseUrl}/api/teams/${selectedTeam._id}/roles`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setRoles(rolesResponse.data.roles);
        } catch (error) {
          console.error('Error fetching roles:', error);
        }
      }
    };
    fetchRoles();
  }, [selectedTeam]);

  const handleCreateRole = async () => {
    if (!newRole.trim()) {
      toast.error('Role name is required');
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${apiBaseUrl}/api/teams/${selectedTeam._id}/roles`,
        { role: newRole },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const rolesResponse = await axios.get(`${apiBaseUrl}/api/teams/${selectedTeam._id}/roles`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoles(rolesResponse.data.roles);
      setNewRole('');
      toast.success('Role created successfully');
    } catch (error) {
      toast.error('Error creating role');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 bg-black text-white border border-[#2c2c2c] rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Manage Roles</h2>

      <div className="mb-6 flex space-x-4 items-center">
        <input
          type="text"
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
          placeholder="Enter new role"
          className="p-2 w-[89%] bg-black border border-[#2c2c2c] outline-none text-white rounded-md"
        />
        <button
          onClick={handleCreateRole}
          disabled={isSubmitting}
          className="w-[11%] py-2 bg-white text-black font-bold rounded-md hover:bg-gray-200 disabled:bg-gray-600"
        >
          {isSubmitting ? 'Creating...' : 'Create Role'}
        </button>
      </div>

      <div className="space-y-2" style={{ maxHeight: '20vh', overflowY: 'auto' }}>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-2xl font-semibold">Existing Roles</h3>
          <span className="text-green-400 text-2xl flex items-center mr-4">
            {roles.length} <FaUserCog className="ml-2" size={25} />
          </span>
        </div>
        {roles.length > 0 ? (
          <ul className="space-y-2">
            {roles.map((role, index) => (
              <li
                key={index}
                className="bg-none hover:bg-[#27272A] cursor-pointer p-3 rounded-md"
              >
                {role}
              </li>
            ))}
          </ul>
        ) : (
          <p>No roles found for this team.</p>
        )}
      </div>
    </div>
  );
};

export default ManageRoles;
