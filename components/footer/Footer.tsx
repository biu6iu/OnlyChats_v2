import React from "react";

export default function Footer({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute bottom-0 left-0 w-full z-20">
      <div className="flex justify-between items-center px-4 py-3 border-t border-[#797C7B] bg-[#282828]/50 backdrop-blur-sm rounded-b-xl">
        {children}
      </div>
    </div>
  );
}
