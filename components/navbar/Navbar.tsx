import React from "react";

export default function Navbar({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-auto flex flex-col justify-between">
      <div className="flex justify-between items-center px-4 py-3 border-t border-gray-800 bg-black/50 backdrop-blur-sm rounded-b-xl">
        {children}
      </div>
    </div>
  );
}
