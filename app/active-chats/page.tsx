"use client";

import Link from "next/link";
import Image from "next/image";
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

export default function ActiveChatsPage() {
  const router = useRouter();
  const [activeChats, setActiveChats] = useState<Chat[]>([]);

  useEffect(() => {
    // In a real app, fetch from backend
    // Mocking data for now
    const mockChats = Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      title: "Post Title",
      comments: 112,
      date: "6/16/2022"
    }));
    
    setActiveChats(mockChats);
  }, []);

  return (
    <main className="flex flex-col min-h-screen w-full bg-[#282828] text-white">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold">Your current chats</h1>
        <div className="flex space-x-4">
          <Search className="w-6 h-6" />
          <User className="w-6 h-6" />
        </div>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-auto">
        {activeChats.map((chat) => (
          <div 
            key={chat.id} 
            className="flex items-center p-4 border-b border-gray-700 hover:bg-gray-800 cursor-pointer"
            onClick={() => router.push(`/chatroom/${chat.id}`)}
          >
            <div className="flex-shrink-0 w-16 h-16 bg-gray-700 rounded flex items-center justify-center mr-4">
              <MessagesSquare className="w-8 h-8 text-gray-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-lg">{chat.title}</h3>
              <p className="text-sm text-gray-400">
                {chat.comments} comments • {chat.date}
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
            <MessagesSquare className="w-7 h-7 text-indigo-500" />
            <p className="text-xs mt-1 text-indigo-500">Current Chats</p>
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
            <Archive className="w-7 h-7" />
            <p className="text-xs mt-1">Archived Chats</p>
          </div>
        </Footer>
      </div>
    </main>
  );
}