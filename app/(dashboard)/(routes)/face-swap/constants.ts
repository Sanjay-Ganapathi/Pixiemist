import * as z from "zod";

import { dropImageSchema } from "@/lib/validations/dropImage";

export const formSchema = z.object({
  sourceImage: dropImageSchema.shape.image,
  targetFace: dropImageSchema.shape.image,
});
