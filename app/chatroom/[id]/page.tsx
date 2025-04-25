"use client";
import "./index.css";

import { useParams } from "next/navigation";
import Chat from "@/components/chat/Chat";

export default function ChatroomPage() {
  const params = useParams();
  const id = params.id;

  return (
    <main className="flex justify-center items-center min-h-screen px-6 bg-[#282828] text-white">
      <div className="container">
      <Chat />
    </div>
    </main>
    
  );
}
