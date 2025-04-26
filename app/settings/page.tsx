"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { ArrowLeft, Bell, Moon, Volume2, Lock, EyeOff } from "lucide-react";

export default function SettingsPage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [sound, setSound] = useState(true);

  useEffect(() => {
    // If not logged in and not loading, redirect to login
    if (!loading && !user && !sessionStorage.getItem("user")) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen px-6 bg-[#282828] text-white">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <main className="flex justify-center items-center min-h-screen px-6 bg-[#282828] text-white">
      <div className="phone-frame relative w-[393px] mx-auto h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center p-4 border-b border-gray-700">
          <button
            onClick={handleBack}
            className="p-2 rounded-full hover:bg-gray-700 mr-4"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold">Settings</h1>
        </div>

        {/* Settings content */}
        <div className="flex-1 overflow-auto p-4">
          <div className="space-y-6">
            {/* App Settings Section */}
            <div>
              <h2 className="text-lg font-medium text-gray-300 mb-3">
                App Settings
              </h2>

              {/* Dark Mode */}
              <div className="flex items-center justify-between py-3 border-b border-gray-700">
                <div className="flex items-center">
                  <Moon className="w-5 h-5 mr-3 text-gray-400" />
                  <span>Dark Mode</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={darkMode}
                    onChange={() => setDarkMode(!darkMode)}
                  />
                  <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              {/* Notifications */}
              <div className="flex items-center justify-between py-3 border-b border-gray-700">
                <div className="flex items-center">
                  <Bell className="w-5 h-5 mr-3 text-gray-400" />
                  <span>Notifications</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notifications}
                    onChange={() => setNotifications(!notifications)}
                  />
                  <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              {/* Sound */}
              <div className="flex items-center justify-between py-3 border-b border-gray-700">
                <div className="flex items-center">
                  <Volume2 className="w-5 h-5 mr-3 text-gray-400" />
                  <span>Sound</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={sound}
                    onChange={() => setSound(!sound)}
                  />
                  <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>

            {/* Privacy Section */}
            <div>
              <h2 className="text-lg font-medium text-gray-300 mb-3">
                Privacy
              </h2>

              <div className="bg-gray-800 rounded-lg overflow-hidden">
                <button className="w-full flex items-center justify-between py-3 px-4 hover:bg-gray-700">
                  <div className="flex items-center">
                    <Lock className="w-5 h-5 mr-3 text-gray-400" />
                    <span>Change Password</span>
                  </div>
                  <ArrowLeft className="w-4 h-4 rotate-180 text-gray-400" />
                </button>

                <button className="w-full flex items-center justify-between py-3 px-4 hover:bg-gray-700">
                  <div className="flex items-center">
                    <EyeOff className="w-5 h-5 mr-3 text-gray-400" />
                    <span>Privacy Settings</span>
                  </div>
                  <ArrowLeft className="w-4 h-4 rotate-180 text-gray-400" />
                </button>
              </div>
            </div>

            {/* App Info */}
            <div className="mt-8 text-center text-gray-500 text-sm">
              <p>OnlyChats v1.0.0</p>
              <p className="mt-1">© 2025 OnlyChats</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
