import * as z from "zod";

export const formSchema = z.object({
  prompt: z.string().min(1, {
    message: "Proompt is required",
  }),
  content: z.string().min(1),
  model: z.string().min(1),
  amount: z.string().min(1),
});

export const amountOptions = [
  {
    value: "1",
    label: "1 Image",
  },
  {
    value: "2",
    label: "2 Images",
  },
  {
    value: "3",
    label: "3 Images",
  },
  {
    value: "4",
    label: "4 Images",
  },
];

export const modelOptions = [
  {
    value: "1",
    label: "Model 1: High Accuracy",
  },
  {
    value: "2",
    label: "Model 2: High Style",
  },
];
