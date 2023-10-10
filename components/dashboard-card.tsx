import React from "react";
import Image from "next/image";

import {
  Card,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface DashboardCardProps {
  img: string;
  heading: string;
  description: string;
}

export const DashboardCard = ({
  img,
  heading,
  description,
}: DashboardCardProps) => {
  return (
    <Card className="max-w-[350px]">
      <Image
        src={img}
        className="w-full rounded-md p-2  "
        alt={description}
        width={500}
        height={500}
      />
      <CardFooter className="flex flex-col items-start justify-center space-y-1 p-2">
        <CardTitle className="text-xl">{heading}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardFooter>
    </Card>
  );
};
