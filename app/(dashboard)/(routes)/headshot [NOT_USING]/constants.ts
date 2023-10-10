import * as z from "zod";

import { dropImageSchema } from "@/lib/validations/dropImage";

export const formSchema = z.object({
  image: dropImageSchema.shape.image,
  gender: z.string({
    required_error: "Gender is required",
  }),
  pose: z.string({
    required_error: "Pose is required",
  }),
});

export const genderOptions = [
  { value: "man", label: "Male" },
  { value: "woman", label: "Female" },
  { value: "unisex", label: "Unisex" },
];

export const poseOptions = [
  { value: "random", label: "Random Pose" },
  { value: "1", label: "Pose 1" },
  { value: "2", label: "Pose 2" },
  { value: "3", label: "Pose 3" },
  { value: "4", label: "Pose 4" },
  { value: "5", label: "Pose 5" },
  { value: "6", label: "Pose 6" },
  { value: "7", label: "Pose 7" },
  { value: "8", label: "Pose 8" },
  { value: "9", label: "Pose 9" },
];
