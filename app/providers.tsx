// app/providers.tsx
"use client";

import { useEffect } from "react";
import { checkAndArchiveInactiveChats } from "@/utils/chatUtils";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import useUserStore from "./zustand/userStore";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [user] = useAuthState(auth);
  const { fetchUserInfo } = useUserStore();

  // Fetch user info when auth state changes
  useEffect(() => {
    if (user?.uid) {
      fetchUserInfo(user.uid);
    }
  }, [user, fetchUserInfo]);

  // Check for inactive chats once when the app loads
  useEffect(() => {
    const runArchiveCheck = async () => {
      if (user) {
        console.log("Checking for inactive chats to archive...");
        const count = await checkAndArchiveInactiveChats();
        if (count > 0) {
          console.log(`Archived ${count} inactive chats`);
        } else {
          console.log("No inactive chats to archive");
        }
      }
    };

    runArchiveCheck();
  }, [user]);

  return <>{children}</>;
}
