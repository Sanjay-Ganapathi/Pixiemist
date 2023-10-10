"use client";

import React, { useState } from "react";

import { UserSubscriptionPlan } from "@/types";
import { cn, formatDate } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

interface BillingCardProps extends React.HTMLAttributes<HTMLDivElement> {
  subscriptionPlan: UserSubscriptionPlan;
  isCancelled: boolean;
}

export const BillingCard = ({
  subscriptionPlan,
  isCancelled,
  className,
}: BillingCardProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    console.log("Submitted");
    try {
      setIsLoading(true);

      const response = await axios.get("/api/stripe");
      window.location.href = response.data.url;
    } catch (err) {
      toast.error("Something went wrong.Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("mx-6", className)}>
      <Card className="border-2 border-primary">
        <CardHeader>
          <CardTitle>Subscription Plan</CardTitle>
          <CardDescription>
            You are currently on{" "}
            <strong>{subscriptionPlan.isPro ? "Pro" : "Free"}</strong> plan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {subscriptionPlan.isPro
            ? "You can enjoy unlimited creations."
            : "The Free Plan allows upto 10 creations. Consider upgrading to Pro for unlimited creations."}
        </CardContent>

        <CardFooter className="flex flex-col items-start space-y-2 md:flex-row md:justify-between md:space-x-0">
          <Button
            disabled={isLoading}
            variant="outline"
            onClick={handleSubmit}
            className="border-primary font-bold tracking-wider transition-colors hover:bg-primary hover:text-white"
          >
            {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
            {subscriptionPlan.isPro ? "Manage Subscription" : "Upgrade to Pro"}
          </Button>
          {subscriptionPlan.isPro ? (
            <p className=" text-xs font-medium">
              {isCancelled
                ? "Your plan will expire on "
                : "Your plan will renew on "}
              {formatDate(subscriptionPlan.stripeCurrentPeriodEnd!)}.
            </p>
          ) : (
            <></>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};
