const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export async function searchUsersByEmail(email) {
  // If there's no input, return empty array
  if (!email) return [];

  try {
    // Adjust the endpoint to match your backend route using BASE_URL
    const response = await fetch(
      `${BASE_URL}/users/search?email=${encodeURIComponent(email)}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

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

export async function searchUsersByUsername(username) {
  if (!username) return [];
  try {
    const response = await fetch(
      `${BASE_URL}/users/search?username=${encodeURIComponent(username)}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    if (!response.ok)
      throw new Error("Failed to search users by username");
    const data = await response.json();
    return data.users || [];
  } catch (error) {
    console.error("Error searching users by username:", error);
    return [];
  }
}
