import { User } from "@prisma/client";

export interface FileWithPreview extends File {
  preview: string;
}

export interface OutputImgSlider {
  previewURL: string;
  outputURL: string;
}

export type UserSubscriptionPlan = Pick<
  User,
  | "stripeCustomerId"
  | "stripeSubscriptionId"
  | "stripePriceId"
  | "stripeCurrentPeriodEnd"
> & {
  isPro: boolean;
};
