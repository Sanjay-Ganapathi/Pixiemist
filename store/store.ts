import { create } from "zustand";

import { User } from "next-auth";

type UserStore = Pick<User, "name" | "email" | "image">;

interface useUserStore {
  user: UserStore;
  setUser: (newUser: UserStore) => void;
  clearUser: () => void;
}
const initialUser: UserStore = {};

export const useUserStore = create<useUserStore>((set) => ({
  user: initialUser,
  setUser: (newUser) => set({ user: newUser }),
  clearUser: () => set({ user: initialUser }),
}));
