"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, Sun, Moon } from "lucide-react";

function Navbar() {
  const router = useRouter();
  const [username, setUsername] = useState("Guest");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Fetch username
  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await fetch("http://localhost:3001/validate", {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setUsername(data.username);
        } else {
          setUsername("Guest");
        }
      } catch (error) {
        console.error("Error fetching username:", error);
        setUsername("Guest");
      }
    };
    fetchUsername();

    // Initialize dark mode from localStorage
    const darkModePreference = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(darkModePreference);
    if (darkModePreference) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Handle dark mode toggle
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("darkMode", (!isDarkMode).toString());
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    router.push("/login");
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch("http://localhost:3001/delete-account", {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        alert(`ChitChat is ${data.message}`);
        router.push("/login");
      } else {
        alert("Failed to delete account. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("There was an error deleting your account.");
    }
    setIsModalOpen(false);
  };

  const handleNoDeletion = () => {
    setIsModalOpen(false);
    setIsDropdownOpen(false);
    router.push("/dashboard");
  };

  return (
    <nav className="bg-[#FDB439] dark:bg-[#2D3748] px-6 py-4 flex items-center justify-between transition-colors duration-200">
      <div className="flex items-center">
        <img src="/logo.png" alt="Chit Chat Logo" className="h-14 w-auto" />
      </div>
      <div className="ml-auto flex items-center space-x-6 mr-12">
        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="text-white p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="text-white font-semibold text-lg hover:underline"
        >
          Logout
        </button>

        {/* My Account Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="text-white font-semibold text-lg hover:underline"
          >
            My Account
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg w-48">
              <ul className="py-2">
                <li className="px-4 py-2 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer">
                  Profile
                </li>
                <li
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-2 text-red-500 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                >
                  Delete Account
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Delete Account Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-1/3">
              <h2 className="text-xl font-semibold mb-4 dark:text-white">
                Are you sure you want to leave ChitChat?
              </h2>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleNoDeletion}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md"
                >
                  No
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 bg-red-500 text-white rounded-md"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Greeting */}
        <div className="text-right">
          <div className="text-white text-sm">Welcome back</div>
          <span className="text-[#2D3748] dark:text-white text-2xl font-semibold">
            {username}
          </span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
