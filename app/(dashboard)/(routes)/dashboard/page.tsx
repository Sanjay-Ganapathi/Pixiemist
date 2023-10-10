import React from "react";
import Link from "next/link";
import { Metadata } from "next";

import { DashboardCard } from "@/components/dashboard-card";
import { tools } from "@/constants";

export const metadata: Metadata = {
  title: "Dashboard",
};

const DashboardPage = () => {
  return (
    <div className="mx-4 grid justify-center gap-x-4 gap-y-10 p-4 md:grid-cols-2 md:justify-start lg:grid-cols-3">
      {tools.map((tool) => (
        <Link key={tool.path} href={tool.path} className="w-fit">
          <DashboardCard
            img={
              tool.image ? tool.image : "https://source.unsplash.com/random/"
            }
            heading={tool.label}
            description={tool.description}
          />
        </Link>
      ))}
    </div>
  );
};

export default DashboardPage;
