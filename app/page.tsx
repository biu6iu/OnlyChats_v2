"use client";

import React, { useState, useRef, useEffect } from "react";
import { Inbox, MessageSquare, MessagesSquare, X } from "lucide-react";
import { useRouter } from "next/navigation";

import Grid from "../components/Grid";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import NewTopicButton from "@/components/footer/newTopicButton";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase/config";
import { signOut } from "firebase/auth";

import useUserStore from "./zustand/userStore";

// Import the Prompt interface from Grid component or define it here
interface Prompt {
  id: number;
  question: string;
  color: string;
}

export default function Home(): React.ReactElement {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newPrompt, setNewPrompt] = useState<string>("");
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState<boolean>(false);
  const [previewPrompt, setPreviewPrompt] = useState<Prompt | null>(null);

  const [user] = useAuthState(auth);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
    }
  };

  // Sample prompts import from backend
  const [prompts, setPrompts] = useState<Prompt[]>([
    {
      id: 1,
      question: "What's your go-to dinner when you're too tired to cook?",
      color: "rgb(67, 56, 202)",
    },
    {
      id: 2,
      question: "What's something specific that helps you fall asleep?",
      color: "rgb(67, 56, 202)",
    },
    {
      id: 3,
      question: "What's a small act of kindness you'll never forget?",
      color: "rgb(67, 56, 202)",
    },
    {
      id: 4,
      question: "What's the most beautiful place you've ever been?",
      color: "rgb(67, 56, 202)",
    },
    {
      id: 5,
      question: "What's a skill you wish you had learned earlier?",
      color: "rgb(67, 56, 202)",
    },
    {
      id: 6,
      question: "What's your favorite childhood memory?",
      color: "rgb(67, 56, 202)",
    },
    {
      id: 7,
      question: "What's the best advice you've ever received?",
      color: "rgb(67, 56, 202)",
    },
    {
      id: 8,
      question: "What's a small thing that makes your day better?",
      color: "rgb(67, 56, 202)",
    },
    {
      id: 9,
      question: "What's a tradition you want to start?",
      color: "rgb(67, 56, 202)",
    },
    {
      id: 10,
      question: "What's something you're proud of but never get to talk about?",
      color: "rgb(67, 56, 202)",
    },
  ]);

  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsModalOpen(false);
        setShowLoginPrompt(false);
      }
    }

    if (isModalOpen || showLoginPrompt) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen, showLoginPrompt]);

  // Function to handle creating a new prompt
  const handleCreatePrompt = (): void => {
    if (newPrompt.trim()) {
      const newId = prompts.length + 1;
      const newPromptObject: Prompt = {
        id: newId,
        question: newPrompt.trim(),
        color: "rgb(67, 56, 202)", // Using the same color as others
      };

      setPrompts([...prompts, newPromptObject]);
      setNewPrompt("");
      setIsModalOpen(false);
      setPreviewPrompt(null);

      // Navigate to the chatroom page for the newly created prompt
      router.push(`/chatroom/${newId}`);
    }
  };

  // Preview the prompt as user types
  useEffect(() => {
    if (newPrompt.trim()) {
      setPreviewPrompt({
        id: 0,
        question: newPrompt.trim(),
        color: "rgb(67, 56, 202)",
      });
    } else {
      setPreviewPrompt(null);
    }
  }, [newPrompt]);

  // Check if user is logged in before showing new topic modal
  const handleNewTopicClick = () => {
    if (user) {
      setIsModalOpen(true);
    } else {
      setShowLoginPrompt(true);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#282828]">
      <div className="phone-frame relative w-[393px] mx-auto h-screen flex flex-col">
        <div className="flex flex-col h-screen">
          <Header />

          <Grid prompts={prompts} />

          {/* Bottom navigation */}
          <Footer className="mb-6">
            {" "}
            {/* Add margin-bottom just on Home Page */}
            <div
              className="flex flex-col justify-center items-center mx-2 cursor-pointer"
              onClick={() => router.push("/active-chats")}
            >
              <MessagesSquare className="w-7 h-7" />
              <p className="text-xs mt-1">Current Chats</p>
            </div>
            <div className="relative -mt-2 z-10">
              <NewTopicButton onClick={handleNewTopicClick} />
            </div>
            <div
              className="flex flex-col justify-center items-center mx-2 cursor-pointer"
              onClick={() => router.push("/archive-chats")}
            >
              <Inbox className="w-7 h-7" />
              <p className="text-xs mt-1">Archived Chats</p>
            </div>
          </Footer>

          {/* Login Prompt Modal */}
          {showLoginPrompt && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
              <div
                ref={modalRef}
                className="bg-gray-800 rounded-lg w-full max-w-md mx-4 p-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-white">
                    Login Required
                  </h3>
                  <button
                    onClick={() => setShowLoginPrompt(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-gray-300 mb-6">
                  You need to be logged in to create a new topic.
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowLoginPrompt(false)}
                    className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowLoginPrompt(false);
                      router.push("/login");
                    }}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500"
                  >
                    Login
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Create Prompt Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
              <div
                ref={modalRef}
                className="bg-gray-800 rounded-lg w-full max-w-md mx-4"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                  <div className="flex items-center space-x-2">
                    <img
                      src="/api/placeholder/40/40"
                      alt="User"
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-gray-200 font-medium">Jane Row</span>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-4">
                  <textarea
                    className="w-full bg-gray-700 text-white rounded-lg p-4 min-h-32 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Write your post or question here"
                    value={newPrompt}
                    onChange={(e) => setNewPrompt(e.target.value)}
                  />

                  <div className="flex items-center mt-4 space-x-2">
                    <button className="flex items-center space-x-2 px-3 py-2 rounded-md bg-gray-700 text-gray-300 text-sm">
                      <span>Add media</span>
                    </button>

                    <button className="flex items-center space-x-2 px-3 py-2 rounded-md bg-gray-700 text-gray-300 text-sm">
                      <span>Add Category</span>
                    </button>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-4 flex justify-end">
                  <button
                    className={`px-5 py-2 rounded-md font-medium transition-colors ${
                      newPrompt.trim()
                        ? "bg-indigo-600 text-white hover:bg-indigo-500"
                        : "bg-gray-600 text-gray-300 cursor-not-allowed"
                    }`}
                    onClick={handleCreatePrompt}
                    disabled={!newPrompt.trim()}
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
