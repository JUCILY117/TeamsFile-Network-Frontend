import React from "react";

const InviteMember = ({ inviteEmail, setInviteEmail, inviteStatus, handleInviteUser }) => {
  return (
<div className="w-full bg-black p-4 rounded-lg mb-6 border border-[#2c2c2c] shadow-[0_4px_6px_rgba(0,0,0,0.2)]">
      <h2 className="text-xl font-semibold mb-4">Invite a Member</h2>
      <div className="flex flex-col space-y-4">
        <input
          type="email"
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
          placeholder="Enter email address"
          className="p-2 bg-black border border-[#2c2c2c] rounded text-white"
        />
        <button
          onClick={handleInviteUser}
          className="bg-white p-2 rounded hover:bg-gray-200 text-black"
        >
          Send Invitation
        </button>
        {inviteStatus && <p className="mt-4 text-gray-300">{inviteStatus}</p>}
      </div>
    </div>
  );
};

export default InviteMember;
