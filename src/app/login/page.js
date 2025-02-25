"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { isMobile } from "@/utils/isMobile";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

const Login = () => {
  const [disabled, setDisabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const router = useRouter();

  const submitHandler = async (e) => {
    e.preventDefault();
    setDisabled(true);
    setErrorMessage(null);

    const usernameOrEmail = e.target.usernameOrEmail.value;
    const password = e.target.password.value;
    const mobileCheck = isMobile(navigator.userAgent); // Detect mobile

    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usernameOrEmail,
          password,
          isMobile: mobileCheck,
        }),
        credentials: "include",
      });

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        if (mobileCheck) {
          localStorage.setItem("authToken", data.token); // Store token for mobile users
        }
        localStorage.setItem("username", usernameOrEmail);
        router.push("/dashboard");
      } else {
        setErrorMessage(data.message || "Invalid username or password.");
        setDisabled(false);
      }
    } catch (error) {
      setErrorMessage("Login error. Please try again.");
      setDisabled(false);
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
            Lets ChitChat!
          </h2>
          <div className="mb-4 w-full">
            <input
              id="usernameOrEmail"
              name="usernameOrEmail"
              type="text"
              required
              className="w-full px-4 py-3 border border-[#ddd] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FDB439] bg-[#FAFAFA] text-[#333333] placeholder-[#999] transition duration-200"
              placeholder="Enter your username or email"
            />
          </div>
          <div className="mb-6 w-full">
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-4 py-3 border border-[#ddd] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FDB439] bg-[#FAFAFA] text-[#333333] placeholder-[#999] transition duration-200"
              placeholder="Enter your password"
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
