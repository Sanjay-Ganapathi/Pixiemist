import Image from "next/image";

const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="relative h-full overflow-auto bg-[#090521] ">
      <Image
        src="/twist_line_edit.png"
        alt="landing"
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 object-cover"
      />
      <div className="relative z-20 h-full w-full ">{children}</div>
    </main>
  );
};
export default LandingLayout;
