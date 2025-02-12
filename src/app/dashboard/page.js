"use client"; // For Next.js App Router usage

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import io from "socket.io-client";

import Navbar from "../../components/Navbar";
import Hamburger from "@/components/dashboard/hamburger/Hamburger";
import NewChatModal from "@/components/dashboard/NewChatModal";
import Menu from "@/components/dashboard/hamburger/Menu/Menu";

// Import the new search function for username
import { searchUsersByUsername } from "@/services/searchService";

export default function DashboardPage() {
  const router = useRouter();

  // State for user info, loading, errors, new chat modal, and hamburger menu
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // New search states for username search
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Socket and chat states
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");

  // State for selected friend (for private messaging)
  const [selectedFriend, setSelectedFriend] = useState(null);

  // Dummy list of friends for demonstration (with id and name)
  const dummyFriends = [
    { id: "friend1", name: "Alice" },
    { id: "friend2", name: "Bob" },
    { id: "friend3", name: "Charlie" },
  ];

  // Fetch dashboard data (User info)
  const fetchDashboardData = async () => {
    try {
      const response = await fetch("http://localhost:3001/validate", {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        setLoading(false);
      } else {
        setError("User not authenticated");
        setLoading(false);
      }
    } catch (error) {
      setError("Error fetching dashboard");
      setLoading(false);
    }
  };

  // Check authentication and fetch user data on mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/login");
    } else {
      fetchDashboardData();
    }
  }, [router]);

  // Initialize Socket.IO connection
  useEffect(() => {
    // Replace the URL with your backend endpoint when deployed
    const newSocket = io("http://localhost:3001", {
      withCredentials: true,
      transports: ["websocket"],
    });
    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, []);

  // Once userData is available, register the user with the socket
  useEffect(() => {
    if (socket && userData && userData._id) {
      socket.emit("register", userData._id);
    }
  }, [socket, userData]);

  // Listen for incoming private messages
  useEffect(() => {
    if (!socket) return;

    socket.on("privateMessage", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off("privateMessage");
    };
  }, [socket]);

  // Handle sending a private message to the selected friend
  const handleSendMessage = () => {
    if (!socket || !currentMessage.trim() || !selectedFriend) return;
    const senderId = userData._id; // Assume userData contains _id
    const receiverId = selectedFriend.id;
    socket.emit("privateMessage", {
      senderId,
      receiverId,
      text: currentMessage,
    });
    // Optionally, add your own message to the conversation immediately
    setMessages((prevMessages) => [
      ...prevMessages,
      { senderId, receiverId, text: currentMessage, createdAt: new Date() },
    ]);
    setCurrentMessage("");
  };

  // Handle search input changes (searching by username)
  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // If the input is empty, clear results and skip searching
    if (!value.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const results = await searchUsersByUsername(value);
      setSearchResults(results);
    } catch (err) {
      console.error(err);
      setSearchResults([]);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  // Filter messages for conversation between current user and selected friend
  const currentConversationMessages =
    selectedFriend && userData
      ? messages.filter(
          (msg) =>
            (msg.senderId === userData._id &&
              msg.receiverId === selectedFriend.id) ||
            (msg.senderId === selectedFriend.id &&
              msg.receiverId === userData._id)
        )
      : [];

  return (
    <div className="relative flex flex-col w-screen h-screen bg-white">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content (Sidebar + Chat Area) */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-80 border-r border-[#FDB439] p-6 flex flex-col justify-between">
          {/* Top section: New Chat button and conversation list */}
          <div>
            <button
              className="w-full bg-[#FDB439] text-white py-3 rounded hover:bg-opacity-90 text-lg"
              onClick={() => setShowNewChatModal(true)}
            >
              + New Group Chat
            </button>

            {/* Conversation List */}
            <div className="mt-6 overflow-y-auto space-y-3">
              {dummyFriends.map((friend) => (
                <div
                  key={friend.id}
                  onClick={() => setSelectedFriend(friend)}
                  className={`p-3 border border-[#FDB439] rounded cursor-pointer hover:bg-[#FDB439] hover:text-white text-lg ${
                    selectedFriend && selectedFriend.id === friend.id
                      ? "bg-[#FDB439] text-white"
                      : ""
                  }`}
                >
                  {friend.name}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom section: Search input & results */}
          <div className="mt-6">
            <input
              type="text"
              placeholder="Search user by username..."
              className="w-full border border-[#FDB439] rounded p-3 text-[#FDB439] text-lg placeholder-[#FDB439] focus:outline-none"
              value={searchTerm}
              onChange={handleSearch}
            />

            {/* Display search results */}
            {searchResults.length > 0 && (
              <div className="mt-2 space-y-1">
                {searchResults.map((user) => (
                  <div
                    key={user._id || user.id}
                    className="border p-2 rounded text-lg text-[#FDB439] cursor-pointer"
                  >
                    {user.username}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex flex-col flex-1">
          {/* Chat Header */}
          <div className="flex justify-between items-center p-6 pr-24 border-b border-t border-[#FDB439]">
            <h2 className="text-[#FDB439] font-semibold text-xl">
              {selectedFriend ? selectedFriend.name : "Chat Title"}
            </h2>
            <Hamburger menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-0 overflow-y-auto space-y-6 bg-white relative">
            {menuOpen && (
              <div className="flex justify-end">
                <Menu />
              </div>
            )}
            <div className="p-6">
              {selectedFriend ? (
                currentConversationMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`max-w-xs p-3 rounded-xl text-lg mb-2 ${
                      msg.senderId === userData._id
                        ? "ml-auto bg-[#FDB439] text-white"
                        : "border border-[#FDB439] text-[#FDB439]"
                    }`}
                  >
                    {msg.text}
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500">
                  Select a friend to start chatting
                </div>
              )}
            </div>
          </div>

          {/* Chat Input */}
          <div className="p-6 border-t border-[#FDB439] flex">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 border border-[#FDB439] rounded p-3 text-[#FDB439] text-lg placeholder-[#FDB439] focus:outline-none"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
            />
            <button
              className="bg-[#FDB439] text-white px-6 py-3 rounded ml-2 hover:bg-opacity-90 text-lg"
              onClick={handleSendMessage}
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Conditionally render the New Chat Modal */}
      {showNewChatModal && (
        <NewChatModal
          friends={dummyFriends}
          onClose={() => setShowNewChatModal(false)}
        />
      )}
    </div>
  );
}
