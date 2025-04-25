"use client";

import type React from "react";

import { Mail, MessageSquare, Plus } from "lucide-react";
import Grid from "../components/Grid";

export default function Home() {
  // Sample prompts import from backend
  const prompts = [
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
  ];
  return (
    <div className="flex flex-col h-screen bg-black">
      <Grid prompts={prompts} />
      {/* Bottom navigation */}
      <div className="flex justify-between items-center px-4 py-3 border-t border-gray-800 bg-black/50 backdrop-blur-sm fixed bottom-0 left-0 right-0">
        <div className="flex items-center justify-center w-12 h-12">
          <div className="text-gray-400">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>

        <button className="bg-indigo-600 text-white rounded-md px-5 py-3 flex items-center justify-center shadow-md hover:bg-indigo-500 transition-colors">
          <Plus className="w-5 h-5 mr-2" />
          <span className="font-medium">New Topic</span>
        </button>

        <div className="flex items-center justify-center w-12 h-12">
          <div className="text-gray-400">
            <Mail className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
