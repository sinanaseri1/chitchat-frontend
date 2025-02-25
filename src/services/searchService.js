const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
console.log("BASE_URL in searchService:", BASE_URL);

export async function searchUsersByEmail(email) {
  // If there's no input, return an empty array
  if (!email) return [];

  try {
    const url = `${BASE_URL}/users/search?email=${encodeURIComponent(email)}`;
    console.log("Fetching search by email at:", url);

    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      // Read error text for debugging
      const errorText = await response.text();
      throw new Error(`Failed to search users by email: ${errorText}`);
    }

    const data = await response.json();
    return data.users || [];
  } catch (error) {
    console.error("Error searching users by email:", error);
    return [];
  }
}

export async function searchUsersByUsername(username) {
  if (!username) return [];
  try {
    const url = `${BASE_URL}/users/search?username=${encodeURIComponent(
      username
    )}`;
    console.log("Fetching search by username at:", url);

    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to search users by username: ${errorText}`);
    }

    const data = await response.json();
    return data.users || [];
  } catch (error) {
    console.error("Error searching users by username:", error);
    return [];
  }
}
