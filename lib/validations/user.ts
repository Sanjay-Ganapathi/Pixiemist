import * as z from "zod";

export const userSettingSchema = z.object({
  username: z.string().min(3).max(30),
});
