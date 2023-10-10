import * as z from "zod";

export const dropImageSchema = z.object({
  image: z.unknown().refine((val) => {
    if (!Array.isArray(val)) return false;
    if (val.some((file) => !(file instanceof File))) return false;
    return true;
  }, "Must be an array of File"),
});
