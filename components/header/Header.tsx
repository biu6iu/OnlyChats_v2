import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, LogOut, Settings, UserCircle } from "lucide-react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { signOut } from "firebase/auth";

export default function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user] = useAuthState(auth);
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
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
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
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleLogin = () => {
    setDropdownOpen(false);
    window.location.href = "/login";
  };

  const handleProfileClick = () => {
    setDropdownOpen(false);
    window.location.href = "/profile";
  };

  const handleSettingsClick = () => {
    setDropdownOpen(false);
    window.location.href = "/settings";
  };

  return (
    <div className="flex flex-col sticky top-0 z-40">
      <div className="flex justify-between items-center px-4 py-3 bg-[#282828] border-b border-gray-700">
        {/* Logo Section */}
        <div className="flex items-center space-x-2">
          <img
            src="/OnlyChats-mini-logo.svg"
            alt="OnlyChats Logo"
            className="w-28 h-auto"
          />
        </div>

        {/* Profile dropdown */}
        <div className="relative" ref={dropdownRef} style={{ zIndex: 9999 }}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-expanded={dropdownOpen}
          >
            <User className="w-6 h-6 text-gray-300" />
          </button>

          {/* Dropdown menu with inline styles for z-index */}
          {dropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 border border-gray-700"
              style={{ zIndex: 9999 }}
            >
              {user || userSession ? (
                <>
                  <div className="px-4 py-2 border-b border-gray-700">
                    <p className="text-sm font-medium text-white truncate">
                      {user?.email || "User"}
                    </p>
                  </div>
                  <a
                    href="/profile"
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                    onClick={(e) => {
                      e.preventDefault();
                      handleProfileClick();
                    }}
                  >
                    <UserCircle className="mr-2 h-4 w-4" />
                    Profile
                  </a>
                  <a
                    href="/settings"
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSettingsClick();
                    }}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </a>
                  <a
                    href="#"
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLogout();
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </a>
                </>
              ) : (
                <a
                  href="/login"
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLogin();
                  }}
                >
                  <User className="mr-2 h-4 w-4" />
                  Log in
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
