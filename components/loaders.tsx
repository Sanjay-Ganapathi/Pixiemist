import { NewtonsCradle } from "@uiball/loaders";
import { cn } from "@/lib/utils";
const Loader = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex w-full items-center justify-center ", className)}>
      <NewtonsCradle size={40} speed={0.8} color="#2563eb" />
    </div>
  );
};

export { Loader };
