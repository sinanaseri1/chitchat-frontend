"use client"; // For Next.js App Router usage

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Navbar from "../../components/Navbar";
import Hamburger from "@/components/dashboard/hamburger/Hamburger";
import NewChatModal from "@/components/dashboard/NewChatModal";
import Menu from "@/components/dashboard/hamburger/Menu/Menu";

export default function DashboardPage() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNewChatModal, setShowNewChatModal] = useState(false);

  // Fetch dashboard data (User info)
  const fetchDashboardData = async () => {
    try {
      const response = await fetch("http://localhost:3001/validate", {
        method: "GET",
      credentials: "include"
      },
      
        );

      if (response.ok) {
        const data = await response.json();
        setUserData(data); // Store the user data to render on the page
        setLoading(false); // Set loading to false once the data is fetched
      } else {
        console.log(response)
        setError("User not authenticated");
        setLoading(false);
      }
    } catch (error) {
      setError("Error fetching dashboard");
      setLoading(false);
    }
  };

  // Call the function on component mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      router.push("/login"); // Redirect to login if not authenticated
    } else {
      fetchDashboardData(); // Fetch dashboard data when user is authenticated
    }
  }, [router]);

  // Loading or error state handling
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // State to control when the modal is visible

  // Dummy list of friends for demonstration
  const dummyFriends = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" },
  ];

  return (
    <div className="relative flex flex-col w-screen h-screen bg-white">
      {/* Top Navbar */}
      <Navbar />

      {/* Main content area: Sidebar + Chat Area */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-80 border-r border-[#FDB439] p-6 flex flex-col justify-between">
          {/* Top section: Create New Group Chat button & conversation list */}
          <div>
            {/* Modified button to open the modal */}
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
              {/* Additional conversation items... */}
            </div>
          </div>

          {/* Bottom section: Search User input */}
          <div className="mt-6">
            <input
              type="text"
              placeholder="Search user..."
              className="w-full border border-[#FDB439] rounded p-3 text-[#FDB439] text-lg placeholder-[#FDB439] focus:outline-none"
            />
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex flex-col flex-1">
          {/* Chat Header */}
          <div className="flex justify-between items-center p-6 pr-24 border-b border-t border-[#FDB439]">
            <h2 className="text-[#FDB439] font-semibold text-xl">Chat Title</h2>
            <Hamburger />
          </div>

          {/* Chat Messages */}

          <div className="flex-1 p-0 overflow-y-auto space-y-6 bg-white relative">
            
						<div className="flex justify-end">
								<Menu />
						</div>

						<div className='p-6'>

            {/* Received message (white background with accent border and text) */}
            <div className="max-w-xs p-3 rounded-xl border border-[#FDB439] text-[#FDB439] text-lg">
              Hello, how are you?
            </div>
            {/* Sent message (#FDB439 background with white text) */}
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
