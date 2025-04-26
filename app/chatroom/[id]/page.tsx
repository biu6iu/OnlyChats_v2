"use client";
import "./index.css";

import { useParams } from "next/navigation";
import Chat from "@/components/chat/Chat";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

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
        const fetchPrompt = async () => {
            try {
                const promptsRef = collection(db, "prompts");
                const q = query(promptsRef, where("id", "==", Number(id)));
                
                const unsubscribe = onSnapshot(q, (snapshot) => {
                    if (!snapshot.empty) {
                        const promptData = snapshot.docs[0].data();
                        setPrompt({
                            id: promptData.id,
                            question: promptData.question,
                            color: "rgb(67, 56, 202)" // Keep consistent color
                        });
                    }
                });

                return () => unsubscribe();
            } catch (error) {
                console.error("Error fetching prompt:", error);
            }
        };

        if (id) {
            fetchPrompt();
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
                <Chat prompt={prompt} />
            </div>
        </main>
    );
}
