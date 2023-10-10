import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/session";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";
import { getUserSubscription } from "@/lib/subscription";

const billingUrl = absoluteUrl("/billing");

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user || !user.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const subscriptionPlan = await getUserSubscription(user.id);

    if (subscriptionPlan instanceof Error) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // User on Pro Plan
    if (subscriptionPlan.isPro && subscriptionPlan.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: subscriptionPlan.stripeCustomerId,
        return_url: billingUrl,
      });

      return new Response(JSON.stringify({ url: stripeSession.url }));
    }

    // User on Free Plan so create checkout session
    const stripeSession = await stripe.checkout.sessions.create({
      success_url: billingUrl,
      cancel_url: billingUrl,
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      customer_email: user.email,
      line_items: [
        {
          price: process.env.STRIPE_PRO_PRICE_ID,
          quantity: 1,
        },
      ],
      metadata: {
        userId: user.id,
      },
    });
    return new Response(JSON.stringify({ url: stripeSession.url }));
  } catch (e) {
    console.log("[STRIPE_API_ERROR]", e);
    return new NextResponse("Payment error", { status: 500 });
  }
}
