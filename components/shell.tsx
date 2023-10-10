import React from "react";

import { cn } from "@/lib/utils";

interface HeadingShellProps extends React.HTMLAttributes<HTMLDivElement> {}

export const HeadingShell = ({
  children,
  className,
  ...props
}: HeadingShellProps) => {
  return (
    <div className={cn("mx-4 grid items-start gap-8 ", className)} {...props}>
      {children}
    </div>
  );
};
