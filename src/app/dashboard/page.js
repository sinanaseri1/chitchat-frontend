"use client"; // For Next.js App Router usage

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import io from "socket.io-client";

import Navbar from "../../components/Navbar";
import Hamburger from "@/components/dashboard/hamburger/Hamburger";
import NewChatModal from "@/components/dashboard/NewChatModal";
import Menu from "@/components/dashboard/hamburger/Menu/Menu";

// Import the search function for username
import { searchUsersByUsername } from "@/services/searchService";

export default function DashboardPage() {
  const router = useRouter();

  // States for user data, loading, errors, modal, hamburger, and friend list
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Search states
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [friends, setFriends] = useState([]); // real users from the DB

  // Socket and chat states
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");

  // Selected friend for private messaging
  const [selectedFriend, setSelectedFriend] = useState(null);

  // Fetch dashboard data (User info)
  const fetchDashboardData = async () => {
    try {
      const response = await fetch("http://localhost:3001/validate", {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        console.log("User data fetched:", data);
        setUserData(data);
        setLoading(false);
      } else {
        setError("User not authenticated");
        setLoading(false);
      }
    } catch (err) {
      console.error("Error fetching dashboard:", err);
      setError("Error fetching dashboard");
      setLoading(false);
    }
  };

  // Fetch all friends from the backend (GET /users?username=)
  const fetchFriends = async () => {
    try {
      const res = await fetch("http://localhost:3001/users?username=", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      console.log("Fetched friends:", data.users);
      // Exclude the current user from the friend list
      const allFriends =
        userData && data.users
          ? data.users.filter((user) => user._id !== userData._id)
          : data.users;
      setFriends(allFriends);
    } catch (err) {
      console.error("Error fetching friends:", err);
    }
  };

  // Check authentication and fetch dashboard data on mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/login");
    } else {
      fetchDashboardData();
    }
  }, [router]);

  // When userData is available, fetch the friend list
  useEffect(() => {
    if (userData) {
      fetchFriends();
    }
  }, [userData]);

  // Initialize Socket.IO connection
  useEffect(() => {
    const newSocket = io("http://localhost:3001", {
      withCredentials: true,
      transports: ["websocket"],
    });
    setSocket(newSocket);
    console.log("Socket initialized:", newSocket.id);

    return () => newSocket.disconnect();
  }, []);

  // Register the current user with the socket once userData is available
  useEffect(() => {
    if (socket && userData && userData._id) {
      socket.emit("register", userData._id);
      console.log("Registered user with socket:", userData._id);
    }
  }, [socket, userData]);

  // Listen for incoming private messages
  useEffect(() => {
    if (!socket) return;

    socket.on("privateMessage", (msg) => {
      console.log("Received privateMessage:", msg);
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off("privateMessage");
    };
  }, [socket]);

  // Handle sending a private message
  const handleSendMessage = () => {
    if (!socket || !currentMessage.trim() || !selectedFriend) return;
    const senderId = userData._id;
    const receiverId = selectedFriend._id;
    console.log(
      "Sending message from",
      senderId,
      "to",
      receiverId,
      ":",
      currentMessage
    );
    socket.emit("privateMessage", {
      senderId,
      receiverId,
      text: currentMessage,
    });
    // Optionally add the message locally immediately
    setMessages((prevMessages) => [
      ...prevMessages,
      { senderId, receiverId, text: currentMessage, createdAt: new Date() },
    ]);
    setCurrentMessage("");
  };

  // Handle search input changes
  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (!value.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const results = await searchUsersByUsername(value);
      setSearchResults(results);
    } catch (err) {
      console.error("Error in search:", err);
      setSearchResults([]);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  // Filter messages for the current conversation (between current user and selected friend)
  const currentConversationMessages =
    selectedFriend && userData
      ? messages.filter(
          (msg) =>
            (msg.senderId === userData._id &&
              msg.receiverId === selectedFriend._id) ||
            (msg.senderId === selectedFriend._id &&
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
          {/* Top section: New Chat button and friend list */}
          <div>
            <button
              className="w-full bg-[#FDB439] text-white py-3 rounded hover:bg-opacity-90 text-lg"
              onClick={() => setShowNewChatModal(true)}
            >
              + New Group Chat
            </button>

            {/* Friend List */}
            <div className="mt-6 overflow-y-auto space-y-3">
              {searchTerm.trim() === ""
                ? friends.map((friend) => (
                    <div
                      key={friend._id}
                      onClick={() => {
                        setSelectedFriend(friend);
                        setMessages([]); // clear current conversation when switching
                      }}
                      className={`p-3 border border-[#FDB439] rounded cursor-pointer hover:bg-[#FDB439] hover:text-white text-lg ${
                        selectedFriend && selectedFriend._id === friend._id
                          ? "bg-[#FDB439] text-white"
                          : ""
                      }`}
                    >
                      {friend.username}
                    </div>
                  ))
                : searchResults.map((user) => (
                    <div
                      key={user._id}
                      onClick={() => {
                        setSelectedFriend(user);
                        setMessages([]);
                      }}
                      className="p-3 border border-[#FDB439] rounded cursor-pointer hover:bg-[#FDB439] hover:text-white text-lg"
                    >
                      {user.username}
                    </div>
                  ))}
            </div>
          </div>

          {/* Bottom section: Search input */}
          <div className="mt-6">
            <input
              type="text"
              placeholder="Search user by username..."
              className="w-full border border-[#FDB439] rounded p-3 text-[#FDB439] text-lg placeholder-[#FDB439] focus:outline-none"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex flex-col flex-1">
          {/* Chat Header */}
          <div className="flex justify-between items-center p-6 pr-24 border-b border-t border-[#FDB439]">
            <h2 className="text-[#FDB439] font-semibold text-xl">
              {selectedFriend ? selectedFriend.username : "Select a Friend"}
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
                currentConversationMessages.length > 0 ? (
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
                    No messages yet. Start the conversation!
                  </div>
                )
              ) : (
                <div className="text-center text-gray-500">
                  Select a friend to start chatting.
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

      {/* New Chat Modal */}
      {showNewChatModal && (
        <NewChatModal
          friends={friends}
          onClose={() => setShowNewChatModal(false)}
        />
      )}
    </div>
  );
}
