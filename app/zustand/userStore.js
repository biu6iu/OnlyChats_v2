import { doc, getDoc } from "firebase/firestore";
import { create } from "zustand";
import { db } from "@/lib/firebase";

const useUserStore = create((set) => ({
  currentUser: null,
  isLoading: false,
  fetchUserInfo: async (uid) => {
    set({ isLoading: true });
    if (!uid) {
      set({ currentUser: null, isLoading: false });
      return;
    }
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        set({ currentUser: { ...docSnap.data(), id: uid }, isLoading: false });
      } else {
        set({ currentUser: null, isLoading: false });
      }
    } catch (err) {
      console.error(err);
      set({ currentUser: null, isLoading: false });
    }
  },
  clearUser: () => set({ currentUser: null, isLoading: false }),
}));

export default useUserStore;
