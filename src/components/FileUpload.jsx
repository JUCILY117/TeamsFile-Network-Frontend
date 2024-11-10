import React from "react";
import { AiOutlineUpload } from "react-icons/ai";

const FileUpload = ({ files, setFiles, isUploading, uploadFile, setUploadFile }) => {
  const handleFileUpload = () => {
    if (!uploadFile) return;
    setIsUploading(true);

    const newFile = {
      _id: Date.now().toString(),
      name: uploadFile.name,
      url: URL.createObjectURL(uploadFile),
    };

    setFiles([...files, newFile]);
    setUploadFile(null);
    setIsUploading(false);
  };

  return (
    <div className="bg-black border border-[#2c2c2c] p-6 rounded-lg m-6 mb-0">
      <h2 className="text-2xl font-semibold text-white mb-6">File Sharing</h2>
      
      {/* Upload Section */}
      <div className="bg-black border border-[#2c2c2c]  p-4 rounded-lg shadow-md mb-6">
        <div className="flex items-center space-x-6">
          <input
            type="file"
            onChange={(e) => setUploadFile(e.target.files[0])}
            className="text-gray-400 rounded-lg px-4 py-2 bg-black border border-[#2c2c2c]  focus:outline-none"
          />
          
          <button
            onClick={handleFileUpload}
            disabled={isUploading}
            className={`flex items-center px-6 py-3 rounded-lg text-black ${isUploading ? "bg-gray-500 cursor-not-allowed" : "bg-white hover:bg-gray-200"}`}
          >
            <AiOutlineUpload className="mr-2" />
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
      
      {/* Uploaded Files List */}
      {files.length > 0 && (
        <div className="bg-gray-700 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-white mb-4">Uploaded Files</h3>
          <ul className="space-y-2">
            {files.map((file) => (
              <li key={file._id} className="text-gray-300">
                <a href={file.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {file.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* No Files Uploaded Message */}
      {files.length === 0 && !isUploading && (
        <p className="text-gray-500 mt-4">No files uploaded yet. Upload a file to get started.</p>
      )}
    </div>
  );
};

export default FileUpload;
