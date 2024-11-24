import React, { useEffect, useRef, useState } from "react";
import { AiOutlineSend, AiOutlineArrowDown } from "react-icons/ai";
import { useAuth } from "../context/AuthContext";

const Chat = ({ chatMessages, newMessage, setNewMessage, handleSendMessage }) => {
  const { user } = useAuth();
  const chatContainerRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);

  const renderProfileImage = (sender) => {
    if (sender && sender.profileImage) {
      return (
        <img
          src={sender.profileImage}
          alt={`${sender.firstName} ${sender.lastName}`}
          className="w-full h-full object-cover"
        />
      );
    } else {
      const initials = sender
        ? `${sender.firstName?.[0] || ''}${sender.lastName?.[0] || ''}`
        : "?";
      return (
        <div className="w-full h-full bg-[#27272A] rounded-full flex items-center justify-center text-white text-2xl">
          {initials}
        </div>
      );
    }
  };

  useEffect(() => {
    const chatContainer = chatContainerRef.current;

    const scrollChatToBottom = () => {
      chatContainer.scrollTo({
        top: chatContainer.scrollHeight,
        behavior: "smooth",
      });
    };

    if (autoScrollEnabled) {
      scrollChatToBottom();
    }

    const handleScroll = () => {
      const isNearBottom =
        chatContainer.scrollHeight - chatContainer.scrollTop <=
        chatContainer.clientHeight + 50;

      setShowScrollButton(!isNearBottom);
      setAutoScrollEnabled(isNearBottom);
    };

    chatContainer.addEventListener("scroll", handleScroll);
    return () => chatContainer.removeEventListener("scroll", handleScroll);
  }, [chatMessages, autoScrollEnabled]);

  const scrollToBottom = () => {
    chatContainerRef.current.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
    setAutoScrollEnabled(true);
  };

  return (
    <div className="w-full bg-black border border-[#2c2c2c] shadow-[0_4px_6px_rgba(0,0,0,0.2)] p-4 rounded-lg mb-6">
      <h2 className="text-xl font-semibold mb-4 text-white">Team Chat</h2>
      <div
        ref={chatContainerRef}
        className="h-[25vw] overflow-y-auto bg-black border border-[#2c2c2c] p-8 rounded-lg mb-4 space-y-4"
      >
        {chatMessages.length === 0 ? (
          <div className="text-center text-gray-400">
            <p>Send your first message</p>
          </div>
        ) : (
          chatMessages.map((msg) => (
            <div
              key={msg._id}
              className={`flex items-start space-x-4 animate-fadeIn ${
                msg.sender?._id === user?._id ? "flex-row-reverse space-x-reverse" : ""
              }`}
            >
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#b5b5b5]">
                {renderProfileImage(msg.sender)}
              </div>
              <div className="flex flex-col space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-300 text-xl font-semibold">
                    {msg.sender
                      ? `${msg.sender.firstName} ${msg.sender.lastName}`
                      : "Unknown Sender:"}
                  </span>
                </div>
                <div
                  className={`p-2 rounded-lg text-sm ${
                    msg.sender?._id === user?._id
                      ? "bg-white text-black text-right font-bold"
                      : "bg-[#2c2c2c] text-white text-left"
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-[25rem] right-1/3 bg-white p-2 rounded-full hover:bg-gray-200"
        >
          <AiOutlineArrowDown className="text-black" />
        </button>
      )}

      <div className="flex items-center space-x-4 mt-4">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="w-full p-2 bg-black border border-[#2c2c2c]  rounded text-white"
          onKeyDown={(e) => {
            if (e.key === "Enter" && newMessage.trim()) {
              handleSendMessage();
            }
          }}
        />
        <button
          onClick={handleSendMessage}
          className="bg-white p-2 rounded hover:bg-gray-200"
        >
          <AiOutlineSend className="text-black" />
        </button>
      </div>
    </div>
  );
};

export default Chat;
