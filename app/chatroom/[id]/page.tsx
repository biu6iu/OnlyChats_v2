"use client";

import { useParams } from "next/navigation";

export default function ChatroomPage() {
  const params = useParams();
  const id = params.id;

  return (
    <div>
      <h1>Chatroom {id}</h1>
      {/* Your chatroom UI here */}
    </div>
  );
}
