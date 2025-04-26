import React from "react";
import { Plus } from "lucide-react";

interface NewTopicButtonProps {
  onClick: () => void;
}

export default function NewTopicButton({ onClick }: NewTopicButtonProps) {
  return (
    <button
      className="bg-indigo-600 text-white rounded-md px-4 py-3 flex items-center justify-center shadow-lg hover:bg-indigo-500 transition-colors hover:shadow-xl"
      onClick={onClick}
    >
      <Plus className="w-5 h-5" strokeWidth={3.5} />
    </button>
  );
}
