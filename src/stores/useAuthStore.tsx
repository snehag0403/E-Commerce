import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type AuthStore = {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  toggleTheme: () => void;
  isLoggedIn: boolean;
  token: string | null;
  login: () => void;
  // logout: () => void;
  logout: () => void;
  user: any | null;
  setToken: (newtoken: string | null) => void;
  setUser: (user: any) => void;
  clearUser: () => void;
  hashydrated: boolean;
  sethydrated: (hashydrated: boolean) => void;
  cart: any;
  setCart: (cart: any) => void;

  wishlistItems: string[];
  isInWishlist: (productId: string) => boolean;
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (productId: string) => void;
  clearWishlist: () => void;
};

const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      theme: "light",
      user: null,
      token: null,
      isLoggedIn: false,
      hashydrated: false,
      cart: null,
      wishlistItems: [],

      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "light" ? "dark" : "light",
        })),
      setUser: (user) => set({ user }),
      setToken: (newtoken) => set({ token: newtoken }),
      login: () => set({ isLoggedIn: true }),
      logout: async () => {
        try {
          await GoogleSignin.signOut();
        } catch (e) {
          // Ignore error if not signed in with Google
        }
        set({
          isLoggedIn: false,
          token: null,
          user: null,
          wishlistItems: [],
          cart: null,
        });
      },

      clearUser: () => set({ user: null }),
      sethydrated: (hashydrated) => set({ hashydrated }),
      setCart: (cart) => set({ cart }),

      isInWishlist: (productId: string) => {
        const state = get();
        return state.wishlistItems.includes(productId);
      },

      addToWishlist: (productId: string) => {
        set((state) => {
          if (!state.wishlistItems.includes(productId)) {
            return {
              wishlistItems: [...state.wishlistItems, productId],
            };
          }
          return state;
        });
      },

      removeFromWishlist: (productId: string) => {
        set((state) => ({
          wishlistItems: state.wishlistItems.filter((id) => id !== productId),
        }));
      },

      toggleWishlist: (productId: string) => {
        const state = get();
        if (state.isInWishlist(productId)) {
          state.removeFromWishlist(productId);
        } else {
          state.addToWishlist(productId);
        }
      },

      clearWishlist: () => set({ wishlistItems: [] }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.sethydrated(true);
      },
    }
  )
);

export default useAuthStore;
