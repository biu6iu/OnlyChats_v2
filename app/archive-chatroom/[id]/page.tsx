// app/archive-chatroom/[id]/page.tsx
"use client";

import "../../chatroom/[id]/index.css";
import { useParams } from "next/navigation";
import ArchivedChat from "../../../components/chat/ArchivedChat";
import { useState, useEffect } from "react";

interface Prompt {
    id: number;
    question: string;
    color: string;
}

export default function ArchivedChatroomPage() {
    const params = useParams();
    const id = params.id;
    const [prompt, setPrompt] = useState<Prompt | null>(null);

    useEffect(() => {
        // Sample prompts - in a real app, this would come from an API
        const prompts: Prompt[] = [
            {
                id: 100,
                question: "What's your go-to dinner when you're too tired to cook?",
                color: "rgb(67, 56, 202)",
            },
            {
                id: 101,
                question: "What's something specific that helps you fall asleep?",
                color: "rgb(67, 56, 202)",
            },
            {
                id: 102,
                question: "What's a small act of kindness you'll never forget?",
                color: "rgb(67, 56, 202)",
            },
            {
                id: 103,
                question: "What's the most beautiful place you've ever been?",
                color: "rgb(67, 56, 202)",
            },
            {
                id: 104,
                question: "What's a skill you wish you had learned earlier?",
                color: "rgb(67, 56, 202)",
            },
            {
                id: 105,
                question: "What's your favorite childhood memory?",
                color: "rgb(67, 56, 202)",
            },
            {
                id: 106,
                question: "What's the best advice you've ever received?",
                color: "rgb(67, 56, 202)",
            },
            {
                id: 107,
                question: "What's a small thing that makes your day better?",
                color: "rgb(67, 56, 202)",
            }
        ];

        const currentPrompt = prompts.find(p => p.id === Number(id));
        if (currentPrompt) {
            setPrompt(currentPrompt);
        }
    }, [id]);

    if (!prompt) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#282828] text-white">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <main className="flex justify-center items-center min-h-screen px-6 bg-[#282828] text-white">
            <div className="container">
                <ArchivedChat prompt={prompt} />
            </div>
        </main>
    );
}