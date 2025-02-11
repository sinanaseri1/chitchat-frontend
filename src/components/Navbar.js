"use client"; 
import React, { useEffect, useState } from "react"; 
import { useRouter } from "next/navigation"; 
import { Menu } from 'lucide-react';

function Navbar() {
  const router = useRouter(); 
  const [username, setUsername] = useState("Guest");
  const [isModalOpen, setIsModalOpen] = useState(false); // State to track if modal is open
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to handle dropdown visibility

  // Fetch username
  useEffect(() => { 
    const fetchUsername = async () => { 
      try { 
        const response = await fetch("http://localhost:3001/validate", { method: "GET", credentials: "include" }); 
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
  }, []);

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
        alert(`ChitChat is ${data.message}`);  // Display the custom message from the backend
        router.push("/login"); // Redirect to the login page after account deletion
      } else {
        alert("Failed to delete account. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("There was an error deleting your account.");
    }
    setIsModalOpen(false); // Close the modal after the action
  };
  
  const handleNoDeletion = () => {
    setIsModalOpen(false); // Close the modal when "No" is clicked
    setIsDropdownOpen(false); // Close the dropdown when "No" is clicked
    router.push("/dashboard"); // Redirect to the dashboard after closing modal
  };

  return (
    <nav className="bg-[#FDB439] px-6 py-4 flex items-center justify-between">
      <div className="flex items-center">
        <img src="/logo.png" alt="Chit Chat Logo" className="h-14 w-auto" />
      </div>
      <div className="ml-auto flex items-center space-x-6 mr-12">
        <button onClick={handleLogout} className="text-white font-semibold text-lg hover:underline">
          Logout
        </button>
        
        {/* Account Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="text-white font-semibold text-lg hover:underline"
          >
            My Account
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-48">
              <ul className="py-2">
                <li className="px-4 py-2 text-black hover:bg-gray-200 cursor-pointer">Profile</li>
                <li
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-2 text-red-500 hover:bg-gray-200 cursor-pointer"
                >
                  Delete Account
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Modal for Delete Account Confirmation */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg w-1/3">
              <h2 className="text-xl font-semibold mb-4">Are you sure you want to leave ChitChat?</h2>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleNoDeletion}  // Close the modal, dropdown, and go to the dashboard
                  className="px-4 py-2 bg-gray-500 text-white rounded-md"
                >
                  No
                </button>
                <button
                  onClick={handleDeleteAccount}  // Trigger the delete request on Yes
                  className="px-4 py-2 bg-red-500 text-white rounded-md"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="text-right">
          <div className="text-white text-sm">Welcome back</div>
          <span className="text-[#2D3748] text-2xl font-semibold">{username}</span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
