import { z } from "zod";

export const userValidation = z.object({
  firstname: z.string().min(2),
  lastname: z.string().min(2),
  username: z.string().min(1),
  bio: z.string().max(255).optional(),
});
