'use client'

import React from 'react';
import ListItem from './ListItem';
import { useRouter } from "next/navigation";
import { revalidatePath } from 'next/cache';

// Define the backend URL using an environment variable with fallback
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

const Menu = ({ selectedFriend}) => {

  const router = useRouter();

  const deleteHistory = async () => {

    if (!selectedFriend) {
      alert('No Chat Selected');
      return;
    }
    
    try {
      const response = await fetch(`${BASE_URL}/messages/delete/${selectedFriend._id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await response.json();
      console.log(data);
      
      // Redirect back to the dashboard (or re-fetch messages if needed)
      router.push("/dashboard");
    } catch (error) {
      console.error("Error deleting history:", error);
    }
  };

  return (
    <div
      // Added top/right positioning, a background color, and z-index for visibility
      className='absolute top-0 right-8 w-[max-content] min-w-[240px] bg-white border-solid border-white border-x-4 shadow-lg z-50'
    >
      <ul>
        <ListItem name="Delete History" onClick={deleteHistory} />
        {/*
          <ListItem name='Add User' />
          <ListItem name='Delete User' />
          <ListItem name='Block User' />
        */}
      </ul>
    </div>
  );
};

export default Menu;
