"use client";

import "./chat.css";
import { useRouter } from "next/navigation";
import { LockIcon } from "lucide-react";

interface Prompt {
    id: number;
    question: string;
    color: string;
}

interface ArchivedChatProps {
    prompt: Prompt;
}

const ArchivedChat = ({ prompt }: ArchivedChatProps) => {
    const router = useRouter();

    const handleBack = () => {
        router.push("/archive-chats");
    };

    return (
        <div className="chat">
            <div className="header">
                <button className="back" onClick={handleBack}>
                    <img src="/back.svg" alt="Back" />
                </button>
                <div className="groupTopic">
                    <span>Archived Topic</span>
                </div>
            </div>

            <div className="top">
                <div className="user">
                    <div className="user-info">
                        <img src="/api/placeholder/30/30" alt="User Avatar" />
                        <div className="user-name">
                            <span>Jane Doe</span>
                        </div>

                        <div className="time">
                            <span>2 hours ago</span>
                        </div>
                    </div>
                    <div className="groupinfo">
                        <p>{prompt.question}</p>
                    </div>
                </div>
            </div>

            <div className="center overflow-auto">
                {/* Message history would be displayed here */}
                <div className="p-4">
                    <div className="message received">
                        <img src="/api/placeholder/30/30" alt="User Avatar" className="w-8 h-8 rounded-full" />
                        <div className="message-content">
                            <div className="username">Alice Smith</div>
                            <div className="text">I usually order takeout when I'm tired. What about you?</div>
                            <div className="time">6/16/2022</div>
                        </div>
                    </div>

                    <div className="message sent">
                        <div className="message-content">
                            <div className="text">I love making a quick pasta dish with whatever is in the fridge!</div>
                            <div className="time">6/16/2022</div>
                        </div>
                    </div>

                    <div className="message received">
                        <img src="/api/placeholder/30/30" alt="User Avatar" className="w-8 h-8 rounded-full" />
                        <div className="message-content">
                            <div className="username">Bob Johnson</div>
                            <div className="text">For me, it's definitely frozen pizza. So easy!</div>
                            <div className="time">6/16/2022</div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Archived notice instead of input bar */}
            <div className="bottom justify-center bg-gray-800 border-t border-gray-700">
                <div className="archived-notice flex items-center justify-center py-3">
                    <LockIcon className="w-5 h-5 mr-2 text-gray-400" />
                    <span className="text-gray-400">This chat is archived</span>
                </div>
            </div>
        </div>
    );
};

export default ArchivedChat;