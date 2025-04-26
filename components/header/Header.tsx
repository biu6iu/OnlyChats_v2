import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { User, LogOut, Settings } from "lucide-react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { signOut } from "firebase/auth";

export default function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, loading] = useAuthState(auth);
  const [userSession, setUserSession] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserSession(sessionStorage.getItem("user"));
    }
  }, [user]);

  useEffect(() => {
    // Close dropdown when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      sessionStorage.removeItem("user");
      setDropdownOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleLogin = () => {
    setDropdownOpen(false);
    router.push("/login");
  };

  const handleProfileClick = () => {
    setDropdownOpen(false);
    router.push("/profile");
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center px-4 py-3 bg-[#282828]/50 backdrop-blur-sm rounded-t-xl">
        {/* Logo Section */}
        <div className="flex items-center space-x-2">
          <Image
            src="/OnlyChats-mini-logo.svg"
            alt="OnlyChats Logo"
            width={120}
            height={40}
          />
        </div>

        {/* Right side icons */}
        <div className="flex items-center space-x-4">
          {/* Profile section with dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-expanded={dropdownOpen}
            >
              {user ? (
                <Image
                  src="/api/placeholder/40/40" 
                  alt="Profile"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <User className="w-6 h-6 text-gray-300" />
              )}
            </button>

            {/* Dropdown menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-700">
                {user || userSession ? (
                  <>
                    <div className="px-4 py-2 border-b border-gray-700">
                      <p className="text-sm font-medium text-white truncate">
                        {user?.email || "User"}
                      </p>
                    </div>
                    <button
                      onClick={handleProfileClick}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleLogin}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Log in
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}