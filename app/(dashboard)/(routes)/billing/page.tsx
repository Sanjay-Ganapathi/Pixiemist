import React from "react";

import { redirect } from "next/navigation";
import { Metadata } from "next";

import { Heading } from "@/components/heading";
import { HeadingShell } from "@/components/shell";
import { getCurrentUser } from "@/lib/session";
import { getUserSubscription } from "@/lib/subscription";
import { stripe } from "@/lib/stripe";
import { BillingCard } from "@/components/billing";

export const metadata: Metadata = {
  title: "Billing",
  description: "Handle your payment and subscription details.",
};

export default async function BillingPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }
  const subscriptionPlan = await getUserSubscription(user.id);

  if (subscriptionPlan instanceof Error) {
    redirect("/sign-in");
  }
  let isCancelled = false;
  if (subscriptionPlan.isPro && subscriptionPlan.stripeSubscriptionId) {
    const stripePlan = await stripe.subscriptions.retrieve(
      subscriptionPlan.stripeSubscriptionId,
    );
    isCancelled = stripePlan.cancel_at_period_end;
  }

  return (
    <>
      <HeadingShell>
        <Heading
          heading="Billing"
          subHeading="Handle your payment and subscription details."
        />
      </HeadingShell>
      <div className="grid ">
        <BillingCard
          className="mt-10"
          subscriptionPlan={subscriptionPlan}
          isCancelled={isCancelled}
        />
      </div>
    </>
  );
}
