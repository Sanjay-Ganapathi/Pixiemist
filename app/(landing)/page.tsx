import { ChevronDown } from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingNav } from "@/components/landing/landing-nav";
import { LandingSection } from "@/components/landing/landing-section";
import { LandingSectionSecond } from "@/components/landing/landing-section-second";
import { LandingSectionThree } from "@/components/landing/landing-section-three";
import { LandingFooter } from "@/components/landing/landing-footer";

export default async function Landing() {
  const user = await getCurrentUser();

  return (
    <>
      <main>
        <section className="mx-auto h-screen max-w-screen-xl ">
          <LandingNav user={user} />
          <LandingHero user={user} />
          <ChevronDown className=" m-auto animate-[fade-in_1.5s_ease-out,bounce_1s_infinite_2s] text-white" />
        </section>
        <section className="mx-auto h-screen w-full bg-white">
          <LandingSection />
        </section>
        <section className="mx-auto h-screen w-full bg-white">
          <LandingSectionSecond />
        </section>
        <div className="h-60 bg-white lg:hidden"></div>
        <section className="mx-auto h-screen w-full bg-white">
          <LandingSectionThree />
        </section>
        <div className="h-64 bg-white md:h-96 lg:hidden"></div>
        <section className="mx-auto mt-6 max-w-screen-xl">
          <LandingFooter />
        </section>
      </main>
    </>
  );
}
