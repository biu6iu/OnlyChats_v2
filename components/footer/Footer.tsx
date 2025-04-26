import React from "react";

export default function Footer({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center px-4 py-3 border-t border-[#797C7B] bg-[#282828]/50 backdrop-blur-sm">
        {children}
      </div>
    </div>
  );
}
