import React from "react";
import Image from "next/image"; // Importing Image component to display the images

export default function Header({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center px-4 py-3 bg-[#282828]/50 backdrop-blur-sm rounded-t-xl">
        {/* Logo Section */}
        <div className="flex items-center space-x-2">
          <Image
            src="/OnlyChats-mini-logo.svg" // Make sure this path matches your actual logo path in the public folder
            alt="OnlyChats Logo"
            width={120}
            height={40}
          />
        </div>

        {/* Search Icon Section */}
        <div className="flex items-center space-x-4 ml-35">
          <Image
            src="/SearchIcon.svg" // Replace with your search icon path
            alt="Search"
            width={24}
            height={24}
          />
        </div>

        {/* Profile Icon Section */}
        <div className="flex items-center">
          <Image
            src="/ProfileIcon.svg" // Replace with your profile picture path
            alt="Profile"
            width={40}
            height={40}
            className="rounded-full" // Adding rounded class for circular profile picture
          />
        </div>
      </div>
    </div>
  );
}
