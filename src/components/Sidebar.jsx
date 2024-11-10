import React from 'react';


const Sidebar = ({ selected, setSelected }) => {


  return (
    <div className="w-66 h-auto min-h-screen bg-black border-t border-l border-[#2c2c2c] text-white flex flex-col">
      <h2 className="text-3xl font-bold p-4 mt-4">My Dashboard</h2>
      <ul>
        <li
          onClick={() => setSelected('home')}
          className={`p-4 cursor-pointer font-bold text-lg hover:bg-white hover:text-black rounded-lg m-4 ${
            selected === 'home' ? 'bg-white text-black font-bold' : ''
          }`}
        >
          Home
        </li>
        <li
          onClick={() => setSelected('teams')}
          className={`p-4 cursor-pointer font-bold text-lg hover:bg-white hover:text-black rounded-lg m-4 ${
            selected === 'teams' ? 'bg-white text-black font-bold' : ''
          }`}
        >
          Teams
        </li>
        <li
          onClick={() => setSelected('recent')}
          className={`p-4 cursor-pointer font-bold text-lg hover:bg-white hover:text-black rounded-lg m-4 ${
            selected === 'recent' ? 'bg-white text-black font-bold' : ''
          }`}
        >
          Recent Activity
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
