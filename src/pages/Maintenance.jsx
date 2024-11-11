import React from 'react';

const MaintenancePage = () => {
  return (
    <div
      className="flex flex-col justify-center items-center h-screen bg-cover bg-[#e7aaaa]"
      style={{
        backgroundImage: "url('https://i.ibb.co/TgHr7rM/love.png')",
      }}
    >
      <h1 className="text-8xl font-extrabold mb-5 text-[#fa4949]">
        💖Maintenance in Progress💘
      </h1>

      <div className="inline-block max-w-full mt-16 mb-12 text-center">
        <img
          src="https://i.ibb.co/YL1QvDN/anmol.jpg"
          alt="Sample Image"
          className="w-[17rem] h-[17rem] border-4 border-[#ce0000] rounded-lg"
        />
      </div>

      <div className="text-5xl font-bold text-white text-center w-[70%] mx-auto">
        Hey <span className="text-red-600">Shawty</span>, you lost? Don't worry,
        you can come with me. I'm sure you can't go back after I{' '}
        <span className="text-blue-500">rizzed</span> you{' '}
        <u className="underline">level 10</u>{' '}
        <strong className="text-[#dd8030]">Gyaatt🍑</strong>!
      </div>
    </div>
  );
};

export default MaintenancePage;
