import * as z from "zod";

import { dropImageSchema } from "@/lib/validations/dropImage";

export const formSchema = z.object({
  image: dropImageSchema.shape.image,
  scale: z.string({
    required_error: "Scale is required",
  }),
});

export const scaleOptions = [
  { value: "2", label: "2x" },
  { value: "3", label: "3x" },
  { value: "4", label: "4x" },
];
