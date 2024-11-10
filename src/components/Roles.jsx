const Roles = ({ teamId, team }) => {
    return (
      <div className="bg-gray-700 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Roles</h2>
        <ul className="space-y-2">
          {team.members.map((member) => (
            <li key={member._id} className="flex items-center justify-between">
              <span>{member.firstName} {member.lastName}</span>
              <span className="text-gray-400 text-sm">{member.role}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default Roles;
  