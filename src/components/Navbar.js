import React from "react";

function Navbar({ username = "Guest" }) {
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
        <button className="text-white font-medium hover:underline">
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
