import prismadb from "@/lib/db";
import { UserSubscriptionPlan } from "@/types";

const GRACE_PERIOD_MS = 86_400_000;

export async function getUserSubscription(
  userId: string,
): Promise<UserSubscriptionPlan | Error> {
  const user = await prismadb.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      stripeSubscriptionId: true,
      stripeCustomerId: true,
      stripePriceId: true,
      stripeCurrentPeriodEnd: true,
    },
  });

  if (!user) {
    return new Error("User not found");
  }

  const isPro =
    user.stripePriceId &&
    user.stripeCurrentPeriodEnd?.getTime()! + GRACE_PERIOD_MS > Date.now();

  return {
    ...user,
    isPro: !!isPro,
  };
}
