import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const apiBaseUrl = import.meta.env.VITE_BASE_API;

const AssignRole = ({ selectedTeam, onNewRoleAdded }) => {
  const [members, setMembers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchMembersAndRoles = async () => {
      if (selectedTeam && selectedTeam._id) {
        try {
          const token = localStorage.getItem('token');

          const rolesResponse = await axios.get(`${apiBaseUrl}/api/teams/${selectedTeam._id}/roles`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setRoles(rolesResponse.data.roles);

          const membersResponse = await axios.get(`${apiBaseUrl}/api/teams/${selectedTeam._id}/members`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          setMembers(membersResponse.data);
        } catch (error) {
          console.error('Error fetching roles or members:', error);
        }
      }
    };
    fetchMembersAndRoles();
  }, [selectedTeam]);

  const handleAssignRole = async () => {
    if (!selectedUser || !selectedRole) {
      toast.error('Please select both a user and a role');
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `${apiBaseUrl}/api/teams/${selectedTeam._id}/members/${selectedUser}/role`,
        { role: selectedRole },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success('Role updated successfully');
      setSelectedUser('');
      setSelectedRole('');
    } catch (error) {
      toast.error('Error updating role');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (onNewRoleAdded) {
      setRoles((prevRoles) => [...prevRoles, onNewRoleAdded]);
    }
  }, [onNewRoleAdded]);

  return (
    <div className="p-4 mt-6 bg-black text-white border border-[#2c2c2c] rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Assign Role</h2>

      <div className="mb-6 flex flex-wrap items-center gap-4">
            {/* Select user */}
            <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="p-2 flex-1 bg-black border border-[#2c2c2c] outline-none text-white rounded-md"
            >
                <option value="" className='text-gray-400' disabled>Select a user</option>
                {members && members.length > 0 ? (
                members.map((member) => (
                    <option key={member._id} value={member._id}>
                    {member.name || 'Unknown Member'}
                    </option>
                ))
                ) : (
                <option disabled>No members found</option>
                )}
            </select>

            <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="p-2 flex-1 bg-black border border-[#2c2c2c] outline-none text-white rounded-md"
            >
                <option value="" className='text-gray-400' disabled>Select a role</option>
                {roles.map((role, index) => (
                <option key={index} value={role}>
                    {role}
                </option>
                ))}
            </select>

            <button
                onClick={handleAssignRole}
                disabled={isSubmitting}
                className="py-2 px-4 bg-white text-black font-bold rounded-md hover:bg-gray-200 disabled:bg-gray-600"
            >
                {isSubmitting ? 'Assigning...' : 'Assign Role'}
            </button>
            </div>
    </div>
  );
};

export default AssignRole;
