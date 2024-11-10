import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';  // Import toast from react-toastify
import 'react-toastify/dist/ReactToastify.css';  // Import the styles

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
        `${apiBaseUrl}/api/files/upload-team-image/${selectedTeam._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log(response); // Check the response structure to debug

      if (response.data?.imageUrl) {
        setTeamImage(response.data.imageUrl); // Update the displayed image
        onUploadSuccess(); // Notify success
      } else {
        toast.error('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error uploading image');
    }
  };

  return (
    <div className="flex flex-col items-center mb-4">
      <div
        className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-500 cursor-pointer"
        onClick={() => document.getElementById('teamImageInput').click()}
        style={{ backgroundImage: `url(${teamImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
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
