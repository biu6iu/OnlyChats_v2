'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      <div className="w-full max-w-xs">
        <h1 className="text-2xl font-bold mb-6">Create account</h1>

        <input
          type="text"
          placeholder="Your name"
          className="w-full bg-transparent border-b border-gray-400 mb-6 p-2 text-sm placeholder-gray-400"
        />

        <input
          type="email"
          placeholder="Your email"
          className="w-full bg-transparent border-b border-gray-400 mb-6 p-2 text-sm placeholder-gray-400"
        />

        {/* Password Field */}
        <div className="relative mb-6">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            className="w-full bg-transparent border-b border-gray-400 p-2 pr-10 text-sm placeholder-gray-400"
          />
          <button
            type="button"
            className="absolute right-2 top-2"
            onClick={() => setShowPassword(!showPassword)}
          >
            <Image
              src={showPassword ? '/eyeslash.svg' : '/eye.svg'}
              alt="Toggle password visibility"
              width={20}
              height={20}
            />
          </button>
        </div>

        {/* Confirm Password Field */}
        <div className="relative mb-6">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm your password"
            className="w-full bg-transparent border-b border-gray-400 p-2 pr-10 text-sm placeholder-gray-400"
          />
          <button
            type="button"
            className="absolute right-2 top-2"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Image
              src={showConfirmPassword ? '/eyeslash.svg' : '/eye.svg'}
              alt="Toggle password visibility"
              width={20}
              height={20}
            />
          </button>
        </div>

        <button className="w-full bg-[#5B3EFF] text-white rounded-full py-3 font-semibold text-sm hover:bg-[#6d52ff]">
          Sign Up
        </button>

        <p className="text-sm text-center mt-4 text-gray-400">
          Already have an account?{' '}
          <Link href="/login" className="text-[#5B3EFF] underline">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
