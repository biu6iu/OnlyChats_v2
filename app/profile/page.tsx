"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/config";
import { User, ArrowLeft, Camera } from "lucide-react";

export default function ProfilePage() {
  const [user, loading] = useAuthState(auth);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user && !sessionStorage.getItem("user")) {
      router.push("/login");
    }

    if (user) {
      setEmail(user.email || "");
      setUsername(
        user.displayName || (user.email ? user.email.split("@")[0] : "")
      );
    }
  }, [user, loading, router]);

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#282828] text-white">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#282828]">
      <div className="phone-frame w-[393px] h-screen flex flex-col overflow-hidden text-white">
        {/* Header */}
        <div className="flex items-center p-4 border-b border-gray-700">
          <button
            onClick={handleBack}
            className="p-2 rounded-full hover:bg-gray-700 mr-4"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold">Profile</h1>
        </div>

        {/* Profile content */}
        <div className="flex-1 overflow-auto flex flex-col items-center p-6">
          <div className="relative mb-6">
            <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-gray-400" />
              )}
            </div>
            <button className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full hover:bg-indigo-700">
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div className="w-full max-w-md space-y-4">
            {/* Username */}
            <div>
              <label className="block text-gray-400 text-sm mb-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white"
              />
            </div>

            {/* Email (read-only) */}
            <div>
              <label className="block text-gray-400 text-sm mb-1">Email</label>
              <input
                type="email"
                value={email}
                readOnly
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-gray-400"
              />
            </div>

            {/* Update button */}
            <button className="w-full bg-indigo-600 text-white rounded-md py-2 mt-6 hover:bg-indigo-700">
              Update Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
