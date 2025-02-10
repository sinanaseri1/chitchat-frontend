// services/searchService.js

export async function searchUsersByEmail(email) {
    // If there's no input, return empty array
    if (!email) return [];
  
    try {
      // Adjust the endpoint to match your backend route
      const response = await fetch(`http://localhost:3001/users/search?email=${encodeURIComponent(email)}`, {
        method: "GET",
        credentials: "include",
      });
  
      if (!response.ok) {
        throw new Error("Failed to search users");
      }
  
      // Assuming the backend returns { users: [ ... ] } or something similar
      const data = await response.json();
      return data.users || [];
    } catch (error) {
      console.error("Error searching users:", error);
      return [];
    }
  }
  