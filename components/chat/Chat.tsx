"use client";

import useUserStore from "@/app/zustand/userStore";
import "./chat.css";
import { useState, useEffect, useRef } from "react";
import EmojiPicker from "emoji-picker-react";
import { useRouter } from "next/navigation";
import { onSnapshot, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Message {
  text: string;
  sender: string;
  timestamp: Date;
  userId: string;
  promptId: number;
}

interface Prompt {
  id: number;
  username: string;
  question: string;
  color: string;
}

interface ChatProps {
  prompt: Prompt;
}

const Chat = ({ prompt }: ChatProps) => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const router = useRouter();
  const endRef = useRef<HTMLDivElement>(null);
  const { currentUser } = useUserStore();

  const handleEmoji = (e: any) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  const handleBack = () => {
    window.location.href = "/";
  };

  const handleSend = async () => {
    if (!text.trim() || !currentUser) return;

    const newMessage: Message = {
      text: text.trim(),
      sender: currentUser.username || "user",
      timestamp: new Date(),
      userId: currentUser.id,
      promptId: prompt.id,
    };

    try {
      const chatRef = doc(db, "chats", "debKOJFRFgpiIxtCb8nE");
      await updateDoc(chatRef, {
        messages: arrayUnion(newMessage),
      });
      setText("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const chatRef = doc(db, "chats", "debKOJFRFgpiIxtCb8nE");
    const unSub = onSnapshot(chatRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setMessages(data.messages || []);
      }
    });
    return () => unSub();
  }, []);

  return (
    <div className="chat">
      <div className="header">
        <button className="back" onClick={handleBack}>
          <img src="/back.svg" alt="" />
        </button>
        <div className="groupTopic">
          <span>Group Topic</span>
        </div>
      </div>

      <div className="top">
        <div className="user">
          <div className="user-info">
            <img src="/avatar.png" alt="" />
            <div className="user-name">
              <span>{prompt.username}</span>
            </div>
          </div>
          <div className="groupinfo">
            <p>{prompt.question}</p>
          </div>
        </div>
      </div>

      <div className="center">
        <div className="message-container">
          {messages
            .filter((message) => message.promptId === prompt.id)
            .map((message, index) => (
              <div
                key={index}
                className={
                  message.sender === currentUser?.username
                    ? "message-own"
                    : "message"
                }
              >
                {message.sender !== currentUser?.username && (
                  <div className="user">
                    <p>{message.sender}</p>
                  </div>
                )}
                <div className="texts">
                  <p>{message.text}</p>
                </div>
              </div>
            ))}
          <div ref={endRef} />
        </div>
      </div>

      <div className="bottom">
        <div className="icons">
          <img src="/Vector.svg" alt="" />
        </div>

        <div className="emoji">
          <img
            src="/smile.svg"
            alt=""
            onClick={() => setOpen((prev) => !prev)}
          />
          {open && (
            <div className="picker">
              <EmojiPicker onEmojiClick={handleEmoji} />
            </div>
          )}
        </div>
        <input
          type="text"
          placeholder="Type your comment here"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
        />
        <button className="send-button" onClick={handleSend}>
          <img src="/send2.svg" alt="" />
        </button>
      </div>
    </div>
  );
};

export default Chat;
