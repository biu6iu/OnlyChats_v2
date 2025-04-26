"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MessagesSquare, Home, Archive, Search, User } from "lucide-react";
import Footer from "@/components/footer/Footer";

// Define chat interface
interface Chat {
  id: number;
  title: string;
  comments: number;
  date: string;
}

export default function ArchiveChatsPage() {
  const router = useRouter();

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#282828]">
      <div className="phone-frame w-[393px] h-screen flex flex-col overflow-hidden text-white relative">
        {/* Modal Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-80 z-50 flex flex-col items-center justify-center">
          <div className="bg-[#333] p-8 rounded-lg text-center max-w-[80%]">
            <h2 className="text-xl font-bold mb-4">Page Under Construction</h2>
            <p className="text-gray-300 mb-6">
              This feature is currently in development.
            </p>
            <button
              onClick={() => router.push("/")}
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-500 transition-colors"
            >
              Return Home
            </button>
          </div>
        </div>

        {/* Rest of the page content (will be blurred/hidden by overlay) */}
        <div className="flex-1 overflow-auto">
          {/* Chat list */}
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className="flex items-center p-4 border-b border-gray-700 hover:bg-gray-800 cursor-pointer"
              onClick={() => router.push(`/archive-chatroom/${i + 100}`)}
            >
              <div className="flex-shrink-0 w-16 h-16 bg-gray-700 rounded flex items-center justify-center mr-4">
                <MessagesSquare className="w-8 h-8 text-gray-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-lg">Post Title</h3>
                <p className="text-sm text-gray-400">
                  112 comments • 6/16/2022
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Navigation */}
        <div className="w-full">
          <Footer>
            <div
              className="flex flex-col justify-center items-center cursor-pointer"
              onClick={() => router.push("/active-chats")}
            >
              <MessagesSquare className="w-7 h-7" />
              <p className="text-xs mt-1">Current Chats</p>
            </div>

            <div
              className="flex flex-col justify-center items-center cursor-pointer"
              onClick={() => router.push("/")}
            >
              <Home className="w-7 h-7" />
              <p className="text-xs mt-1">Explore Chats</p>
            </div>

            <div
              className="flex flex-col justify-center items-center cursor-pointer"
              onClick={() => router.push("/archive-chats")}
            >
              <Archive className="w-7 h-7 text-indigo-500" />
              <p className="text-xs mt-1 text-indigo-500">Archived Chats</p>
            </div>
          </Footer>
        </div>
      </div>
    </div>
  );
}
