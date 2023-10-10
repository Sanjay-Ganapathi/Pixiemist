import * as z from "zod";

import { dropImageSchema } from "@/lib/validations/dropImage";

export const formSchema = z.object({
  image: dropImageSchema.shape.image,
  prompt: z.string().min(1, {
    message: "Prompt is required",
  }),
});
