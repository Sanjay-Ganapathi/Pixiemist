import React from "react";
import { RemoveBgLanding } from "./removebg-landing";
import { DM_Serif_Display } from "next/font/google";
import { cn } from "@/lib/utils";

const font = DM_Serif_Display({ weight: "400", subsets: ["latin"] });

export const LandingSectionThree = () => {
  return (
    <main className="p-4 text-center text-slate-900">
      <div className="mt-20 p-8 sm:mt-28 md:mt-36 lg:p-16">
        <RemoveBgLanding />
        <div
          className={cn(
            "mt-16 pr-10 text-right text-xl md:text-3xl lg:text-4xl",
            font.className,
          )}
        >
          And many more ...
        </div>
      </div>
    </main>
  );
};
