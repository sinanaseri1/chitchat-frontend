"use client";
import React from "react";
import { useRouter } from "next/navigation"; // Import useRouter hook

function Navbar({ username = "Guest" }) {
  const router = useRouter(); // Initialize useRouter hook

  // Handle Logout
  const handleLogout = () => {
    // Clear the auth token (from localStorage or cookies)
    localStorage.removeItem("authToken");

    // Optionally clear cookies if you're using cookies for session management
    // document.cookie = "token=; Max-Age=0; path=/";

    // Redirect to the login page after logging out
    router.push("/login");
  };

  return (
    <nav className="bg-[#FDB439] px-6 py-4 flex items-center justify-between">
      {/* Left side: App Logo */}
      <div className="flex items-center">
        <img src="/logo.png" alt="Chit Chat Logo" className="h-14 w-auto" />
      </div>

      {/* Right side: My Account button, Logout button, Username */}
      <div className="flex items-center space-x-4">
        <button className="text-white font-medium hover:underline">
          My Account
        </button>
        <button
          onClick={handleLogout} // Attach the handleLogout function
          className="text-white font-medium hover:underline"
        >
          Logout
        </button>
        <span className="text-white text-xl font-sans font-semibold">
          {username}
        </span>
      </div>
    </nav>
  );
}

export default Navbar;
