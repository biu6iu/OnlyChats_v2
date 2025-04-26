"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MessagesSquare, Home, Archive, Search, User } from "lucide-react";
import Footer from "@/components/footer/Footer";
import useUserStore from "@/app/zustand/userStore";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";

// Update interface to match our prompt structure
interface Chat {
  id: number;
  question: string;
  createdAt: Date;
  userId: string;
  username: string;
}

export default function ActiveChatsPage() {
  const router = useRouter();
  const [activeChats, setActiveChats] = useState<Chat[]>([]);
  const [user] = useAuthState(auth);
  const { currentUser, fetchUserInfo } = useUserStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserInfo(user.uid);
    }
  }, [user, fetchUserInfo]);

  useEffect(() => {
    if (!currentUser) return;

    const promptsRef = collection(db, "prompts");
    // Remove orderBy to avoid index requirement
    const q = query(promptsRef, where("userId", "==", currentUser.id));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        try {
          const fetchedChats = snapshot.docs.map((doc) => ({
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate(),
          })) as Chat[];

          // Sort in memory instead of using orderBy
          const sortedChats = fetchedChats.sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
          );

          setActiveChats(sortedChats);
          setError(null);
        } catch (err) {
          console.error("Error processing chats:", err);
          setError("Error loading chats. Please try again.");
        }
      },
      (err) => {
        console.error("Error in snapshot listener:", err);
        setError("Error loading chats. Please try again.");
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#282828]">
        <div className="phone-frame w-[393px] h-screen flex flex-col items-center justify-center text-white">
          <p className="text-lg mb-4">Please sign in to view your chats</p>
          <button
            onClick={() => router.push("/login")}
            className="bg-indigo-600 text-white rounded-md px-4 py-2 hover:bg-indigo-500"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#282828]">
      <div className="phone-frame w-[393px] h-screen flex flex-col overflow-hidden text-white">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-700">
          <h1 className="text-2xl font-bold">My Chats</h1>
          <div className="flex space-x-4">
            <Search
              className="w-6 h-6 cursor-pointer"
              onClick={() => router.push("/search")}
            />
            <User
              className="w-6 h-6 cursor-pointer"
              onClick={() => router.push("/profile")}
            />
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-4 bg-red-500 bg-opacity-10 text-red-400">
            {error}
          </div>
        )}

        {/* Chat list */}
        <div className="flex-1 overflow-auto">
          {activeChats.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <MessagesSquare className="w-12 h-12 mb-4" />
              <p>No active chats yet</p>
              <button
                onClick={() => router.push("/")}
                className="mt-4 text-indigo-400 hover:text-indigo-300"
              >
                Start a new chat
              </button>
            </div>
          ) : (
            activeChats.map((chat) => (
              <div
                key={chat.id}
                className="flex items-center p-4 border-b border-gray-700 hover:bg-gray-800 cursor-pointer transition-colors"
                onClick={() => router.push(`/chatroom/${chat.id}`)}
              >
                <div className="flex-shrink-0 w-16 h-16 bg-gray-700 rounded flex items-center justify-center mr-4">
                  <MessagesSquare className="w-8 h-8 text-gray-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-lg">{chat.question}</h3>
                  <p className="text-sm text-gray-400">
                    Created {chat.createdAt.toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Navigation */}
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
    </div>
  );
}
