"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "../firebase/config";

export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();

  const [createUserWithEmailAndPassword] =
    useCreateUserWithEmailAndPassword(auth);

  const validateAndSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    try {
      const res = await createUserWithEmailAndPassword(email, password);
      if (res) {
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        // Optionally store user session
        // sessionStorage.setItem("user", "true");
        router.push("/login");
      } else {
        alert("Signup failed. Please check your email and password.");
      }
    } catch (error: any) {
      alert(error.message || "An error occurred during signup.");
      console.error(error);
    }
  };

  return (
    <main className="flex flex-col justify-center items-center min-h-screen px-6 bg-[#282828] text-white w-[393px] mx-auto">
      {/* Logo */}
      <div className="mb-10 mt-10 text-center">
        <Image
          src="/onlychats-logo-svg.svg"
          alt="OnlyChats Logo"
          width={250}
          height={100}
          priority
        />
      </div>

      {/* Sign Up Form */}
      <form className="w-full max-w-xs" onSubmit={validateAndSignup}>
        <h1 className="text-2xl font-bold mb-6">Create account</h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full bg-transparent border-b border-gray-400 mb-6 p-2 text-sm placeholder-gray-400"
        />

        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-transparent border-b border-gray-400 mb-6 p-2 text-sm placeholder-gray-400"
        />

        {/* Password Field */}
        <div className="relative mb-6">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent border-b border-gray-400 p-2 pr-10 text-sm placeholder-gray-400"
          />
          <button
            type="button"
            className="absolute right-2 top-2"
            onClick={() => setShowPassword(!showPassword)}
          >
            <Image
              src={showPassword ? "/eyeslash.svg" : "/eye.svg"}
              alt="Toggle password visibility"
              width={20}
              height={20}
            />
          </button>
        </div>

        {/* Confirm Password Field */}
        <div className="relative mb-6">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-transparent border-b border-gray-400 p-2 pr-10 text-sm placeholder-gray-400"
          />
          <button
            type="button"
            className="absolute right-2 top-2"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Image
              src={showConfirmPassword ? "/eyeslash.svg" : "/eye.svg"}
              alt="Toggle password visibility"
              width={20}
              height={20}
            />
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-[#5B3EFF] text-white rounded-full py-3 font-semibold text-sm hover:bg-[#6d52ff]"
        >
          Sign Up
        </button>

        <p className="text-sm text-center mt-4 text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="text-[#5B3EFF] underline">
            Login
          </Link>
        </p>
      </form>
    </main>
  );
}
