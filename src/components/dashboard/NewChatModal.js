import React, { useState, useRef, useEffect } from "react";

const NewChatModal = ({ onClose, friends }) => {
  const [selectedFriends, setSelectedFriends] = useState([]);
  const modalRef = useRef(null);

  // Close the modal if clicking outside the modal container
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Toggle friend selection
  const toggleFriend = (friendId) => {
    setSelectedFriends((prev) =>
      prev.includes(friendId)
        ? prev.filter((id) => id !== friendId)
        : [...prev, friendId]
    );
  };

  // Handle creating a new chat with selected friends
  const handleCreateChat = () => {
    // Here you can implement the logic for creating a new chat using `selectedFriends`
    console.log("Creating chat with:", selectedFriends);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div ref={modalRef} className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-2xl font-bold mb-4">Start a New Chat</h2>
        <div className="max-h-60 overflow-y-auto mb-4">
          {friends.map((friend) => (
            <div key={friend.id} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={`friend-${friend.id}`}
                checked={selectedFriends.includes(friend.id)}
                onChange={() => toggleFriend(friend.id)}
                className="mr-2"
              />
              <label htmlFor={`friend-${friend.id}`} className="text-gray-800">
                {friend.name}
              </label>
            </div>
          ))}
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateChat}
            className="px-4 py-2 bg-[#FDB439] text-white rounded hover:bg-[#FDB439]/90"
          >
            Create Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewChatModal;
