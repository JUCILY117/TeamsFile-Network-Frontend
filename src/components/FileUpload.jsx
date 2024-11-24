import React, { useState, useEffect } from "react";
import { AiOutlineUpload } from "react-icons/ai";
import { GiFiles } from "react-icons/gi";
import { FileUploader } from "./ui/file-upload";
import { FaRegEye } from "react-icons/fa";
import { FaDownload } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { IoIosLink } from "react-icons/io";
import axios from "axios";
import { useParams } from 'react-router-dom';
import { saveAs } from "file-saver";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const apiBaseUrl = import.meta.env.VITE_BASE_API;

const FileUpload = () => {
  const { teamId } = useParams();
  const [showOverlay, setShowOverlay] = useState(false);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentFile, setCurrentFile] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const openOverlay = () => setShowOverlay(true);
  const closeOverlay = () => setShowOverlay(false);

  const stopPropagation = (e) => e.stopPropagation();

  useEffect(() => {
    if (showOverlay && teamId) {
      fetchFiles(teamId);
    }
  }, [showOverlay, teamId]);

  const fetchFiles = async (teamId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${apiBaseUrl}/api/files/team/${teamId}/files`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data && response.data.files && Array.isArray(response.data.files)) {
        setFiles(response.data.files);
      } else {
        setFiles([]);
      }
    } catch (err) {
      setError("Failed to retrieve files. Please try again.");
      console.error("Error fetching files:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (newFiles) => {
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleDownload = (fileUrl, filename) => {
    saveAs(fileUrl, filename);
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
  };  

  const handleDragStart = (e) => {
    e.preventDefault();
  };

  const getFileThumbnail = (file) => {
    if (file.fileType && file.fileType.startsWith("image")) {
      return <img src={file.fileUrl} alt={file.filename} className="w-full h-full object-cover rounded-lg object-contain" />;
    } else if (file.fileType && file.fileType.startsWith("video")) {
      return <video src={file.fileUrl} alt={file.filename} className="w-full h-full object-cover rounded-lg object-contain" controls />;
    } else {
      return <div className="w-full h-40 bg-gray-600 rounded-lg flex items-center justify-center"><span className="text-white">File</span></div>;
    }
  };

  const openFileInOverlay = (file) => {
    setCurrentFile(file);
  };

  const closePreviewOverlay = () => {
    setCurrentFile(null);
  };

  const handleDeleteConfirmation = (fileId) => {
    setFileToDelete(fileId);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${apiBaseUrl}/api/files/team/${fileToDelete}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setFiles((prevFiles) => prevFiles.filter((file) => file._id !== fileToDelete));
      setShowDeleteModal(false);
    } catch (err) {
      console.error("Error deleting file:", err);
      alert("Failed to delete the file. Please try again.");
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success('Link copied to clipboard!'))
      .catch(err => console.error('Failed to copy text: ', err));
  };

  return (
    <div className="bg-black border border-[#2c2c2c] p-6 rounded-lg m-6 mb-0">
      <h2 className="text-2xl font-semibold text-white mb-6">File Sharing</h2>

      <div className="bg-black rounded-lg shadow-md flex items-center justify-evenly mb-6">
        <GiFiles className="text-white text-5xl" />
        <button
          onClick={openOverlay}
          className="bg-white font-bold text-black px-6 py-3 rounded-lg hover:bg-gray-200"
        >
          Explore your team resources
        </button>
      </div>

      {showOverlay && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 animate-fade-in"
          onClick={closeOverlay}
        >
          <div
            className="bg-black border border-[#2c2c2c] text-white rounded-lg shadow-lg w-3/4 h-[85%] flex overflow-hidden"
            onClick={stopPropagation}>
            <div className="w-1/2 p-8 border-r border-[#2c2c2c] flex flex-col">
              <h3 className="text-4xl font-semibold mb-8 p-4">Upload Files</h3>
              <FileUploader teamId={teamId} onUploadSuccess={handleFileUpload} />
            </div>

            <div className="w-1/2 p-12 overflow-y-auto">
              <h3 className="text-4xl font-semibold mb-4">Uploaded Files</h3>
              {loading && <p className="text-gray-400">Loading files...</p>}
              {files && files.length > 0 ? (
                <div className="grid grid-cols-2 gap-6 mt-8">
                  {files.map((file) => (
                    <div
                      key={file._id}
                      className="bg-black border border-[#2c2c2c] p-4 rounded-lg flex flex-col items-center min-w-[15vw]"
                      onContextMenu={handleContextMenu}
                      onDragStart={handleDragStart}
                    >
                      <p className="font-semibold mb-2 overflow-hidden text-ellipsis whitespace-nowrap max-w-full min-h-[3vh]">
                        {file.filename}
                      </p>
                      {getFileThumbnail(file)}
                      <div className="flex items-center mt-2">
                        {file.uploadedByPfp && (
                          <img
                            src={file.uploadedByPfp}
                            alt={`${file.uploadedByName}'s profile`}
                            className="w-6 h-6 rounded-full mr-2 border border-[#2c2c2c]"
                          />
                        )}
                        <div className="flex gap-8">
                          <p className="text-sm text-gray-400">By: <span className="font-bold text-gray-300">{file.uploadedByName}</span></p>
                          <p className="text-sm text-gray-200 font-bold">{file.fileSize}</p>
                        </div>
                      </div>
                      <div className="flex text-xl space-x-4 mt-4">
                        <button
                          onClick={() => openFileInOverlay(file)}
                          className="text-white hover:text-blue-500 hover:scale-[1.2]"
                          title="View Preview"
                        >
                          <FaRegEye />
                        </button>
                        <button
                          onClick={() => handleDownload(file.fileUrl, file.filename)}
                          className="text-white hover:text-green-500 hover:scale-[1.2]"
                          title="Download File"
                        >
                          <FaDownload />
                        </button>
                        <button
                          onClick={() => handleDeleteConfirmation(file._id)}
                          className="text-white hover:text-red-600 hover:scale-[1.2]"
                          title="Delete File"
                        >
                          <MdDelete />
                        </button>
                        <button
                          onClick={() => copyToClipboard(file.fileUrl)}
                          className="text-white hover:text-orange-400 hover:scale-[1.2]"
                          title="Copy Sharable Link"
                        >
                          <IoIosLink />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No files uploaded yet.</p>
              )}
              </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 animate-fade-in">
        <div className="bg-black text-white p-6 rounded-lg border border-[#4c4c4c] flex flex-col">
          <h2 className="p-2 font-bold text-xl">Are you absolutely sure?</h2>
          <p className="p-2 mb-4 text-gray-400">This action cannot be undone. This will permanently delete this file.</p>
          <div className="flex flex-row space-x-4 justify-end">
            <button
              onClick={handleDelete}
              className="bg-white text-black font-bold px-6 py-2 rounded-lg hover:bg-gray-200"
            >
              Yes, Delete
            </button>
            <button
              onClick={handleCancelDelete}
              className="bg-none px-6 py-2 rounded-lg hover:bg-[#27272A]"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>      
      )}

      {currentFile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 animate-fade-in"
          onClick={closePreviewOverlay}
        >
          <div
            className="bg-black border border-[#4c4c4c] text-white rounded-lg shadow-lg max-w-[50vw] max-h-[90vh] p-1 mx-auto overflow-hidden"
            onClick={stopPropagation}
            onContextMenu={handleContextMenu}
            onDragStart={handleDragStart}
          >
            {getFileThumbnail(currentFile)}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
