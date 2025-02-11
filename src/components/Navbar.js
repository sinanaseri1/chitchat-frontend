"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Initialize useRouter hook

function Navbar() {
  const router = useRouter(); // Initialize useRouter hook
  const [username, setUsername] = useState("Guest");

  // Fetch username from the backend (cookies contain the token)
  useEffect(() => {
    // Make a request to the backend to fetch the username
    const fetchUsername = async () => {
      try {
        const response = await fetch("http://localhost:3001/validate", {
          method: "GET",
          credentials: "include", // Include cookies in the request
        });

        if (response.ok) {
          const data = await response.json();
          setUsername(data.username); // Set the username received from backend
        } else {
          setUsername("Guest"); // Set to "Guest" if the user is not authenticated
        }
      } catch (error) {
        console.error("Error fetching username:", error);
        setUsername("Guest");
      }
    };

    fetchUsername();
  }, []);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    // No need to remove username from localStorage now
    router.push("/login");
  };

  return (
    <nav className="bg-[#FDB439] px-6 py-4 flex items-center justify-between">
      <div className="flex items-center">
        <img src="/logo.png" alt="Chit Chat Logo" className="h-14 w-auto" />
      </div>

      <div className="ml-auto flex items-center space-x-6 mr-12">
        <button
          onClick={handleLogout}
          className="text-white font-semibold text-lg hover:underline"
        >
          Logout
        </button>

        <button className="text-white font-semibold text-lg hover:underline">
          My Account
        </button>

        <div className="text-right">
          <div className="text-white text-sm">Welcome back</div>

          <span className="text-[#2D3748] text-2xl font-semibold">
            {username}
          </span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
