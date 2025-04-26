"use client";

import React, { useState, useRef, useEffect } from "react";
import { Inbox, MessageSquare, MessagesSquare, User, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  orderBy,
  limit,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

import Grid from "../components/Grid";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import NewTopicButton from "@/components/footer/newTopicButton";

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
  const [prompts, setPrompts] = useState<Prompt[]>([]);

  const [user] = useAuthState(auth);
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();

  useEffect(() => {
    if (user) {
      fetchUserInfo(user.uid);
    }
  }, [user, fetchUserInfo]);

  // Fetch prompts from Firestore
  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const promptsRef = collection(db, "prompts");
        const q = query(promptsRef, orderBy("createdAt", "desc"));

        // Set up real-time listener
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const fetchedPrompts = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: data.id,
              question: data.question,
              color: "rgb(67, 56, 202)", // Keep consistent color
            };
          });
          setPrompts(fetchedPrompts);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching prompts:", error);
      }
    };

    fetchPrompts();
  }, []);

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

  // Check if user is logged in before showing new topic modal
  const handleNewTopicClick = () => {
    if (user) {
      setIsModalOpen(true);
    } else {
      setShowLoginPrompt(true);
    }
  };

  const handleCreatePrompt = async (): Promise<void> => {
    if (!newPrompt.trim() || !currentUser) return;

    try {
      // Get the latest prompt to determine the next ID
      const promptsRef = collection(db, "prompts");
      const latestPromptQuery = query(
        promptsRef,
        orderBy("id", "desc"),
        limit(1)
      );
      const querySnapshot = await getDocs(latestPromptQuery);

      let nextId = 1;
      if (!querySnapshot.empty) {
        nextId = (querySnapshot.docs[0].data().id || 0) + 1;
      }

      const promptRef = await addDoc(collection(db, "prompts"), {
        id: nextId,
        question: newPrompt.trim(),
        userId: currentUser.id,
        username: currentUser.username,
        createdAt: serverTimestamp(),
      });

      setNewPrompt("");
      setIsModalOpen(false);
      router.push(`/chatroom/${nextId}`);
    } catch (error) {
      console.error("Error creating prompt:", error);
      alert("Failed to create prompt. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#282828]">
      <div className="phone-frame relative w-[393px] mx-auto h-screen flex flex-col">
        <div className="flex flex-col h-full">
          <Header />

          <Grid prompts={prompts} />

          {/* Bottom navigation */}
          <Footer>
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
                    <User className="w-8 h-8 text-gray-300" />
                    <span className="text-gray-200 font-medium">
                      {" "}
                      {currentUser?.username}
                    </span>
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
