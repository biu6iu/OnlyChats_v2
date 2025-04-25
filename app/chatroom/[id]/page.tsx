"use client";
import "./index.css";

import { useParams } from "next/navigation";
import Chat from "@/components/chat/Chat";
import { useState, useEffect } from "react";

interface Prompt {
    id: number;
    question: string;
    color: string;
}

export default function ChatroomPage() {
    const params = useParams();
    const id = params.id;
    const [prompt, setPrompt] = useState<Prompt | null>(null);

    useEffect(() => {
        // Sample prompts - in a real app, this would come from an API
        const prompts: Prompt[] = [
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
            }
        ];

        const currentPrompt = prompts.find(p => p.id === Number(id));
        if (currentPrompt) {
            setPrompt(currentPrompt);
        }
    }, [id]);

    if (!prompt) {
        return <div>Loading...</div>;
    }

    return (
        <main className="flex justify-center items-center min-h-screen px-6 bg-[#282828] text-white">
            <div className="container">
                <Chat prompt={prompt} />
            </div>
        </main>
    );
}
