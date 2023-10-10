import Image from "next/image";
import { DM_Serif_Display } from "next/font/google";
import { cn } from "@/lib/utils";
import { ChevronsDown, ChevronsRight } from "lucide-react";

const font = DM_Serif_Display({ weight: "400", subsets: ["latin"] });

export const HeadShotLanding = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 md:flex-row  lg:gap-8">
      <div className="max-w-[350px] text-start">
        <h1 className={cn("text-2xl md:text-4xl lg:text-5xl", font.className)}>
          Generate Realistic Image from Painting Portrait.
        </h1>
      </div>
      <div className="flex flex-col items-center justify-center gap-4  lg:flex-row ">
        <Image
          src="/real-art-src.jpg"
          alt="Portrait Painting"
          width={350}
          height={350}
          className="rounded-sm"
        />
        <ChevronsRight size={34} strokeWidth={3} className="hidden lg:block" />
        <ChevronsDown className="lg:hidden" />
        <Image
          src="/real-art-res.png"
          alt="Realistic Portrait "
          width={350}
          height={350}
          className="rounded-sm"
        />
      </div>
    </div>
  );
};
