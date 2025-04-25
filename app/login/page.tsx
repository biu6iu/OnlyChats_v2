"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "../firebase/config";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);

  const handleSignIn = async () => {
    try {
      const res = await signInWithEmailAndPassword(email, password);
      if (res) {
        sessionStorage.setItem("user", "true");
        setEmail("");
        setPassword("");
        window.location.href = "/";
      } else {
        // Show an error message to the user
        alert("Invalid email or password.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="flex flex-col justify-center items-center min-h-screen px-6 bg-[#282828] text-white">
      {/* Logo */}
      <div className="mb-10 text-center">
        <Image
          src="/onlychats-logo-svg.svg" // make sure this path matches the logo file in your public folder
          alt="OnlyChats Logo"
          width={250}
          height={100}
          priority
        />
      </div>

      {/* Login Header */}
      <h1 className="text-2xl font-bold mb-6 w-full max-w-xs">Login</h1>

      {/* Login form */}
      <div className="w-full max-w-xs">
        <input
          type="email"
          placeholder="Email"
          className="w-full bg-transparent border-b border-gray-400 mb-6 p-2 text-sm placeholder-gray-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full bg-transparent border-b border-gray-400 mb-4 p-2 text-sm placeholder-gray-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="text-right text-sm mb-6">
          <a href="#" className="text-[#5B3EFF]">
            Forgot password?
          </a>
        </div>
        <button
          onClick={handleSignIn}
          className="w-full bg-[#5B3EFF] text-white rounded-full py-3 font-semibold text-sm hover:bg-[#6d52ff]"
        >
          Login
        </button>
        <p className="text-sm text-center mt-4 text-gray-400">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-[#5B3EFF] underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
