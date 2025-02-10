"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter hook
import Image from "next/image"; // Import Next.js Image component
import Link from "next/link"; // Import Next.js Link component

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
    const password = e.target.password.value;

    // Check if the password is valid
    if (!passwordRegex.test(password)) {
      setErrorMessage(
        "Password must contain at least one digit, one lowercase letter, one uppercase letter, one special character, and be between 8 and 16 characters long."
      );
      setDisabled(false);
      return;
    }

    try {
      // Make API call to register the user
      const response = await fetch("http://localhost:3001/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          include: "credentials"
        },
        body: JSON.stringify({ username, password }),
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
            Create an account
          </h2>

          <div className="mb-4 w-full">
            <label
              htmlFor="username"
              className="block text-[#333333] text-lg font-medium mb-2"
            >
              Email
            </label>
            <input
              id="username"
              name="username"
              type="email"
              required
              className="w-full px-4 py-3 border border-[#ddd] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FDB439] bg-[#FAFAFA] text-[#333333] placeholder-[#999] transition duration-200"
              placeholder="Enter your email"
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
              placeholder="Enter a password"
            />
          </div>

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
            {disabled ? "Signing up..." : "Sign up"}
          </button>

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
