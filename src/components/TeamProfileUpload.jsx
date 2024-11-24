import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const apiBaseUrl = import.meta.env.VITE_BASE_API;

const TeamProfileUpload = ({ selectedTeam, onUploadSuccess }) => {
  const [teamImage, setTeamImage] = useState(selectedTeam?.teamImage || '');

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('teamImage', file);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${apiBaseUrl}/api/files/upload-team-image/${selectedTeam.uuid}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log(response);

      if (response.data?.teamImage) {
        setTeamImage(response.data.teamImage);
        onUploadSuccess();
      } else {
        toast.error('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error uploading image');
    }
  };

  return (
    <div className="flex flex-col items-center m-8">
      <div
          className="w-48 h-48 rounded-full overflow-hidden border-2 border-gray-400 flex items-center justify-center bg-[#242424]  select-none cursor-pointer hover:grayscale hover:border-4 hover:border-white"
          onClick={() => document.getElementById('teamImageInput').click()}
          style={{
            backgroundImage: teamImage
              ? `url(${teamImage})`
              : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          title='Upload New or Change Existing Image'
        >
          {!teamImage && (
            <span className="text-8xl font-bold text-white">
              {selectedTeam.name
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
        <input
          type="file"
          id="teamImageInput"
          onChange={handleImageUpload}
          className="hidden"
          accept="image/*"
        />
      </div>
    </div>
  );
};

export default TeamProfileUpload;
