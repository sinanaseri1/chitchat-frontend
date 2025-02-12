"use client"; // For Next.js App Router usage

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import io from "socket.io-client";

import Navbar from "../../components/Navbar";
import Hamburger from "@/components/dashboard/hamburger/Hamburger";
import NewChatModal from "@/components/dashboard/NewChatModal";
import Menu from "@/components/dashboard/hamburger/Menu/Menu";

import { searchUsersByUsername } from "@/services/searchService";

export default function DashboardPage() {
  const router = useRouter();

  // Basic states for user info, loading, error handling, modal, hamburger menu
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // States related to searching users by username
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Socket.io and message-related states
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");

  // Store *real* users from the database
  const [allUsers, setAllUsers] = useState([]);
  // Track which user you are currently chatting with
  const [selectedFriend, setSelectedFriend] = useState(null);

  // ========== 1. Validate and fetch user data ========== //

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

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/login");
    } else {
      fetchDashboardData();
    }
  }, [router]);

  // ========== 2. Set up Socket.IO ========== //

  // Create the socket connection
  useEffect(() => {
    const newSocket = io("http://localhost:3001", {
      withCredentials: true,
      transports: ["websocket"],
    });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Once we know the user's ID, register with the server
  useEffect(() => {
    if (socket && userData && userData._id) {
      socket.emit("register", userData._id);
    }
  }, [socket, userData]);

  // Listen for incoming private messages
  useEffect(() => {
    if (!socket) return;

    socket.on("privateMessage", (msg) => {
      // Append new message to the list
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("privateMessage");
    };
  }, [socket]);

  // ========== 3. Fetch all real users from DB (excluding self) ========== //

  const fetchAllUsers = async () => {
    try {
      const res = await fetch("http://localhost:3001/users", {
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await res.json();
      // Exclude current user from the list
      const filteredUsers = data.users.filter((u) => u._id !== userData._id);
      setAllUsers(filteredUsers);
    } catch (err) {
      console.error("Error fetching all users:", err);
    }
  };

  // When userData is available, fetch real users
  useEffect(() => {
    if (userData && userData._id) {
      fetchAllUsers();
    }
  }, [userData]);

  // ========== 4. Searching by username (existing logic) ========== //

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (!value.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const results = await searchUsersByUsername(value);
      // Optionally exclude the current user from search results:
      const filtered = results.filter((u) => u._id !== userData._id);
      setSearchResults(filtered);
    } catch (err) {
      console.error(err);
      setSearchResults([]);
    }
  };

  // ========== 5. Sending & Displaying Private Messages ========== //

  const handleSendMessage = () => {
    if (!socket || !currentMessage.trim() || !selectedFriend) return;

    // Construct the message object
    const senderId = userData._id;
    const receiverId = selectedFriend._id; // real user's _id
    const text = currentMessage;

    // Emit the privateMessage event to the backend
    socket.emit("privateMessage", {
      senderId,
      receiverId,
      text,
    });

    // Optionally add it immediately to our messages state for an instant display
    setMessages((prev) => [
      ...prev,
      { senderId, receiverId, text, createdAt: new Date() },
    ]);
    setCurrentMessage("");
  };

  // Filter messages for the current conversation: user <-> selectedFriend
  const currentConversation = selectedFriend
    ? messages.filter(
        (msg) =>
          (msg.senderId === userData._id &&
            msg.receiverId === selectedFriend._id) ||
          (msg.senderId === selectedFriend._id &&
            msg.receiverId === userData._id)
      )
    : [];

  // ========== 6. Rendering UI ========== //

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="relative flex flex-col w-screen h-screen bg-white">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content (Sidebar + Chat Area) */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-80 border-r border-[#FDB439] p-6 flex flex-col justify-between">
          <div>
            {/* New Group Chat button */}
            <button
              className="w-full bg-[#FDB439] text-white py-3 rounded hover:bg-opacity-90 text-lg"
              onClick={() => setShowNewChatModal(true)}
            >
              + New Group Chat
            </button>

            {/* Conversation List: real users from the DB (excluding self) */}
            <div className="mt-6 overflow-y-auto space-y-3">
              {allUsers.map((friend) => (
                <div
                  key={friend._id}
                  onClick={() => setSelectedFriend(friend)}
                  className={`p-3 border border-[#FDB439] rounded cursor-pointer hover:bg-[#FDB439] hover:text-white text-lg ${
                    selectedFriend && selectedFriend._id === friend._id
                      ? "bg-[#FDB439] text-white"
                      : ""
                  }`}
                >
                  {friend.username}
                </div>
              ))}
            </div>
          </div>

          {/* Search input & results */}
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
                    key={user._id}
                    className="border p-2 rounded text-lg text-[#FDB439] cursor-pointer"
                    onClick={() => {
                      setSelectedFriend(user);
                      setSearchResults([]);
                      setSearchTerm("");
                    }}
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
              {selectedFriend ? selectedFriend.username : "Chat Title"}
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
                currentConversation.map((msg, index) => {
                  const isMe = msg.senderId === userData._id;
                  return (
                    <div
                      key={index}
                      className={`max-w-xs p-3 rounded-xl text-lg mb-2 ${
                        isMe
                          ? "ml-auto bg-[#FDB439] text-white"
                          : "border border-[#FDB439] text-[#FDB439]"
                      }`}
                    >
                      {msg.text}
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-gray-500">
                  Select a user to start chatting
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
          friends={allUsers}
          onClose={() => setShowNewChatModal(false)}
        />
      )}
    </div>
  );
}
