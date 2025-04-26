import React from "react";

export default function Header({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute top-0 left-0 w-full z-20">
      <div className="flex justify-between items-center px-4 py-3 bg-[#282828]/50 backdrop-blur-sm rounded-t-xl">
        {children}
      </div>
    </div>
  );
}
