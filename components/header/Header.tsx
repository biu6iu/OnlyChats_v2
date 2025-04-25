import React from "react";

export default function Header({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-800 bg-black/50 backdrop-blur-sm rounded-t-xl">
        {children}
      </div>
    </div>
  );
}
