"use client";
import { User } from "next-auth";

import { useUserStore } from "@/store/store";
import { useEffect } from "react";

type UserStoreProviderProps = {
  user: Pick<User, "name" | "email" | "image">;
};

export default function UserStoreProvider({ user }: UserStoreProviderProps) {
  const setUser = useUserStore((state) => state.setUser);
  useEffect(() => {

  setUser({
    name: user.name,
    email: user.email,
    image: user.image,
  });
  },[setUser, user.email, user.image, user.name])
  return <></>;
}
