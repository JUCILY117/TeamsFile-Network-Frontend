import React, { useState } from 'react';
import { FaHome, FaUsers, FaHistory } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';
const Sidebar = ({ selected, setSelected }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`min-h-screen bg-black border-t border-l border-[#2c2c2c] text-white flex flex-col transition-all duration-300 ease-in-out ${
        isHovered ? 'w-72' : 'w-20'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
     <div className="flex items-center justify-center p-4 mt-4">
        <img
          src='/logo.png'
          alt="Logo"
          className={`transition-all duration-300 ease-in-out ${isHovered ? 'w-14' : 'w-14'}`}
        />
        {isHovered && (
          <h2 className="text-[1.8rem] font-bold text-left ml-4 mr-2"><span className='text-blue-500'>Team</span><span className='text-orange-400'>Share</span> Network</h2>
        )}
      </div>
      <ul
        className={`flex flex-col ${
          isHovered ? 'items-start' : 'items-center'
        }`}
      >
        <li
          onClick={() => setSelected('home')}
          className={`flex items-center p-3 cursor-pointer font-bold text-lg hover:bg-white hover:text-black rounded-lg m-4 ${
            selected === 'home' ? 'bg-white text-black transition-all duration-300' : ''
          }`}
        >
          <FaHome size={25} className="mr-0" />
          <span className={`${isHovered ? 'ml-4 w-[10vw]' : 'hidden'}`}>Home</span>
        </li>
        <li
          onClick={() => setSelected('teams')}
          className={`flex items-center p-3 cursor-pointer font-bold text-lg hover:bg-white hover:text-black rounded-lg m-4 ${
            selected === 'teams' ? 'bg-white text-black transition-all duration-300' : ''
          }`}
        >
          <FaUsers size={25} className="mr-0" />
          <span className={`${isHovered ? 'ml-4 w-[10vw]' : 'hidden'}`}>Teams</span>
        </li>
        <li
          onClick={() => setSelected('recent')}
          className={`flex items-center p-3 cursor-pointer font-bold text-lg hover:bg-white hover:text-black rounded-lg m-4 ${
            selected === 'recent' ? 'bg-white text-black transition-all duration-300' : ''
          }`}
        >
          <FaHistory size={25} className="mr-0" />
          <span className={`${isHovered ? 'ml-4 w-[10vw]' : 'hidden'}`}>Recent Activity</span>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
