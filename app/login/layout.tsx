import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OnlyChats",
  description: "OnlyChats - Codebrew 2025",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <div className="flex justify-center items-center min-h-screen bg-[#282828]">
          <div className="phone-frame">{children}</div>
        </div>
      </body>
    </html>
  );
}
