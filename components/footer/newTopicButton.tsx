import React from "react";
import { Plus } from "lucide-react";

interface NewTopicButtonProps {
  onClick: () => void;
}

export default function NewTopicButton({ onClick }: NewTopicButtonProps) {
  return (
    <button
      className="bg-indigo-600 text-white rounded-md px-5 py-3 flex items-center justify-center shadow-md hover:bg-indigo-500 transition-colors"
      onClick={onClick}
    >
      <Plus className="w-5 h-5 mr-2" />
      <span className="font-medium">New Topic</span>
    </button>
  );
}
