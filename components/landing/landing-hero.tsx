import Link from "next/link";

import { cn } from "@/lib/utils";
import { Instrument_Sans, Ubuntu } from "next/font/google";
import { TypewriterLandingComponent } from "./typewrite-landing";
import { Button } from "@/components/ui/button";
import { User } from "next-auth";

const font = Instrument_Sans({
  weight: "600",
  subsets: ["latin"],
});
const font_2 = Ubuntu({ weight: "700", subsets: ["latin"] });

type LandingHeroProps = {
  user?: User;
};

export const LandingHero = ({ user }: LandingHeroProps) => {
  return (
    <div className=" space-y-5 py-36 text-center font-bold text-white">
      <div
        className={cn(
          "animate-fade-in-up space-y-5 p-1 text-4xl font-extrabold sm:text-5xl md:text-6xl lg:text-7xl",
          font.className,
        )}
      >
        <h1>Unlock a world of creative possibilities with </h1>
        <div
          className={cn(
            "h-16 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-6xl text-transparent md:h-24 md:text-8xl",
            font_2.className,
          )}
        >
          <TypewriterLandingComponent />
        </div>
      </div>
      <div className="mt-10 animate-[fade-in-up_1.5s_ease-in-out] space-y-5 text-center ">
        <Link href={user ? "/dashboard" : "/sign-in"}>
          <Button
            variant="outline"
            className="rounded-md border-none bg-primary tracking-wider text-white transition-colors hover:bg-slate-800 hover:text-white"
          >
            Get Started – It&apos;s Free!
          </Button>
        </Link>

        <div className="text-xs font-normal text-zinc-400 md:text-sm">
          No Credit Card required
        </div>
      </div>
    </div>
  );
};
