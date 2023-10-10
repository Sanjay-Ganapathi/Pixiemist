import React from "react";

import { MobileSidebar } from "@/components/mobile-sidebar";
import { UserAccountNav } from "@/components/user-account-nav";
import { getCreationCount } from "@/lib/api-limit";
import { ModeToggle } from "@/components/theme-toggle";

export const Navbar = async ({ isPro }: { isPro: boolean }) => {
  const creationCount = await getCreationCount();

  return (
    <div className="flex items-center p-4">
      <MobileSidebar creationCount={creationCount} isPro={isPro} />
      <div className="flex w-full justify-end gap-4">
        <ModeToggle />
        <UserAccountNav />
      </div>
    </div>
  );
};
