"use client";

import { useParams } from "next/navigation";
import Chat from "@/components/chat/Chat";

export default function ChatroomPage() {
  const params = useParams();
  const id = params.id;

  return (
    <div className="h-screen bg-[rgb(40,40,40)]">
      <Chat />
    </div>
  );
}
