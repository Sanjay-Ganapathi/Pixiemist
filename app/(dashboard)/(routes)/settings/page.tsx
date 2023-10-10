import React from "react";

import { redirect } from "next/navigation";
import { Metadata } from "next";

import { Heading } from "@/components/heading";
import { HeadingShell } from "@/components/shell";
import { getCurrentUser } from "@/lib/session";
import { UserSettingsForm } from "@/components/user-settings-form";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage account settings.",
};

const Settings = async () => {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }
  return (
    <>
      <HeadingShell>
        <Heading heading="Settings" subHeading="Manage account settings." />
      </HeadingShell>
      <div className="grid ">
        <UserSettingsForm
          user={{ id: user.id, name: user.name ?? "" }}
          className="mt-10"
        />
      </div>
    </>
  );
};
export default Settings;
