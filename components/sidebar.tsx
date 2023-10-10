"use client";

import { Montserrat } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { routes } from "@/constants";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/store";
import { FreeCounter } from "./free-counter";
import { UserAvatar } from "./user-avatar";

const montserrat = Montserrat({ weight: "600", subsets: ["latin"] });

interface SidebarProps {
  creationCount: number;
  isPro: boolean;
}

export const Sidebar = ({ creationCount, isPro }: SidebarProps) => {
  const pathname = usePathname();

  const user = useUserStore((state) => state.user);

  return (
    <div className="flex h-full flex-col bg-[#161719] py-4 text-white">
      <div className="flex-1 px-3 py-2">
        <Link href="/dashboard" className="mb-14 flex items-center pl-3">
          <div className="relative mr-2 h-10 w-10">
            <Image fill alt="Logo" src="/logo3.png" sizes="50%" />
          </div>
          <h1 className={cn(montserrat.className, "text-2xl font-bold")}>
            Pixiemist
          </h1>
        </Link>
        <div className="flex items-center pl-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-800">
            <UserAvatar
              user={{
                name: user.name ?? user.email ?? "MysteriousOne",
                image: user.image ?? "avatar_fallback.jpg",
              }}
              className="h-10 w-10 rounded-xl "
            />
          </div>

          <p className="text-md ml-2 truncate font-medium text-gray-400">
            {user.name || user.email}
          </p>
        </div>
        <div className="mt-10 space-y-1">
          {routes.map((route) => (
            <Link
              key={route.path}
              href={route.path}
              className={cn(
                "flex w-full cursor-pointer justify-start rounded-xl p-3 text-sm font-medium transition hover:bg-primary hover:text-white",
                pathname === route.path
                  ? "bg-primary text-white"
                  : "text-gray-400",
              )}
            >
              <div className="flex flex-1 items-center">{route.label}</div>
            </Link>
          ))}
        </div>
      </div>
      <FreeCounter creationCount={creationCount} isPro={isPro} />
    </div>
  );
};
