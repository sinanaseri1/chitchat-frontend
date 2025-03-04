"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter hook
import Image from "next/image"; // Import Next.js Image component
import Link from "next/link"; // Import Next.js Link component

// Define the backend URL using an environment variable with fallback
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

const Signup = () => {
  const [disabled, setDisabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const router = useRouter(); // Initialize the router

  // Password validation regex
  const passwordRegex =
    /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@#$%^&(){}[\]:;<>,.?/~_+\-=|\\]).{8,16}$/;

  const submitHandler = async (e) => {
    e.preventDefault();
    setDisabled(true);
    setErrorMessage(null);

    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    // Check if the email and password are valid
    if (!passwordRegex.test(password)) {
      setErrorMessage(
        "Password must contain at least one digit, one lowercase letter, one uppercase letter, one special character, and be between 8 and 16 characters long."
      );
      setDisabled(false);
      return;
    }

    try {
      // Make API call to register the user
      const response = await fetch(`${BASE_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to login page after successful signup
        router.push("/login");
      } else {
        setErrorMessage(
          data.message || "Failed to create an account. Please try again."
        );
        setDisabled(false);
      }
    } catch (error) {
      console.error("Sign-up failed:", error);
      setErrorMessage("An error occurred during sign-up. Please try again.");
      setDisabled(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-[#FDB439] to-[#FA9D39]">
      <div className="flex flex-col items-center gap-4">
        {/* Logo Image */}
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
            Join the ChitChat crew!
          </h2>

          {/* Email Input */}
          <div className="mb-4 w-full">
            <label
              htmlFor="email"
              className="block text-[#333333] text-lg font-medium mb-2"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-4 py-3 border border-[#ddd] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FDB439] bg-[#FAFAFA] text-[#333333] placeholder-[#999] transition duration-200"
              placeholder="Enter your email"
            />
          </div>

          {/* Username Input */}
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

          {/* Password Input */}
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
              placeholder="Enter a password"
            />
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="text-red-600 text-sm mb-4">{errorMessage}</div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={disabled}
            className={`w-full py-3 rounded-md text-white font-semibold ${
              disabled ? "bg-[#DDA15E]" : "bg-[#FDB439] hover:bg-[#FA9D39]"
            } transition duration-200`}
          >
            {disabled ? "Signing up..." : "Sign up"}
          </button>

          {/* Login Link */}
          <div className="mt-4 text-center">
            <span className="text-[#333333] text-sm">
              Already have an account?
            </span>
            <Link
              href="/login"
              className="ml-1 text-[#FDB439] hover:text-[#FA9D39] font-semibold text-sm transition duration-200"
            >
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
