"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const Login = () => {
  const [disabled, setDisabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null); // For error handling
  const router = useRouter();

  const submitHandler = async (e) => {
    e.preventDefault(); // Prevent page reload on form submit
    setDisabled(true); // Disable the button while submitting
    setErrorMessage(null); // Reset any previous error message

    const username = e.target.username.value;
    const password = e.target.password.value;

    try {
      // Send the login request to the backend via an API call
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Make sure to send JSON
        },
        body: JSON.stringify({ username, password }), // Send the form data
        credentials: "include", // Ensure cookies are sent with the request
      });

      const data = await response.json(); // Expecting a token or success message

      // If the login was successful (status 200), handle the response
      if (response.ok) {
        // Store the token securely (localStorage for this example)
        localStorage.setItem("authToken", data.token); // Store token in localStorage (or cookie)

        // Redirect to the dashboard after successful login
        router.push("/dashboard");
      } else {
        // Handle failed login attempts
        console.error("Login failed:", data.message);
        setErrorMessage(data.message || "Invalid credentials.");
        setDisabled(false); // Re-enable the button
      }
    } catch (error) {
      console.error("An error occurred while logging in:", error);
      setErrorMessage("An error occurred during login. Please try again.");
      setDisabled(false); // Re-enable the button on error
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-[#FDB439] to-[#FA9D39]">
      <div className="flex flex-col items-center gap-4">
        <Image
          src="/logo.png"
          alt="Logo"
          width={200}
          height={200}
          className="mb-6"
        />

        <form
          onSubmit={submitHandler}
          className="bg-white p-8 rounded-lg shadow-lg w-96 max-w-md flex flex-col items-center"
        >
          <h2 className="text-2xl font-bold text-center text-[#333333] mb-6">
            Come on in!
          </h2>

          <div className="mb-4 w-full">
            <label
              htmlFor="username"
              className="block text-[#333333] text-lg font-medium mb-2"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="w-full px-4 py-3 border border-[#ddd] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FDB439] bg-[#FAFAFA] text-[#333333] placeholder-[#999] transition duration-200"
              placeholder="Enter your username"
            />
          </div>

          <div className="mb-6 w-full">
            <label
              htmlFor="password"
              className="block text-[#333333] text-lg font-medium mb-2"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-4 py-3 border border-[#ddd] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FDB439] bg-[#FAFAFA] text-[#333333] placeholder-[#999] transition duration-200"
              placeholder="Enter your password"
            />
          </div>

          {/* Display error message if login fails */}
          {errorMessage && (
            <div className="text-red-600 text-sm mb-4">{errorMessage}</div>
          )}

          <button
            type="submit"
            disabled={disabled}
            className={`w-full py-3 rounded-md text-white font-semibold ${
              disabled ? "bg-[#DDA15E]" : "bg-[#FDB439] hover:bg-[#FA9D39]"
            } transition duration-200`}
          >
            {disabled ? "Signing in..." : "Sign in"}
          </button>

          <div className="mt-4 text-center">
            <Link
              href="/signup"
              className="ml-1 text-[#FDB439] hover:text-[#FA9D39] font-semibold text-md transition duration-200"
            >
              Register here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

