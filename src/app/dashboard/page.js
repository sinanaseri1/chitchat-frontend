"use client"; // For Next.js App Router usage
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/login");
    } else {
      fetchDashboardData();
    }
  }, [router]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  // Dummy list of friends for demonstration purposes
  const dummyFriends = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" },
  ];

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
              <div className="p-3 border border-[#FDB439] rounded cursor-pointer hover:bg-[#FDB439] hover:text-white text-lg">
                Chat 1
              </div>
              <div className="p-3 border border-[#FDB439] rounded cursor-pointer hover:bg-[#FDB439] hover:text-white text-lg">
                Chat 2
              </div>
              <div className="p-3 border border-[#FDB439] rounded cursor-pointer hover:bg-[#FDB439] hover:text-white text-lg">
                Chat 3
              </div>
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
            <h2 className="text-[#FDB439] font-semibold text-xl">Chat Title</h2>

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
              <div className="max-w-xs p-3 rounded-xl border border-[#FDB439] text-[#FDB439] text-lg">
                Hello, how are you?
              </div>
              <div className="max-w-xs ml-auto bg-[#FDB439] text-white p-3 rounded-xl text-lg">
                I am fine, thanks!
              </div>
            </div>
          </div>

          {/* Chat Input */}
          <div className="p-6 border-t border-[#FDB439] flex">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 border border-[#FDB439] rounded p-3 text-[#FDB439] text-lg placeholder-[#FDB439] focus:outline-none"
            />
            <button className="bg-[#FDB439] text-white px-6 py-3 rounded ml-2 hover:bg-opacity-90 text-lg">
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
