import { z } from "zod";

export const TokenLocationSchema = z.object({
  start: z.object({
    offset: z.number(),
    line: z.number(),
    column: z.number(),
  }),
  end: z.object({
    offset: z.number(),
    line: z.number(),
    column: z.number(),
  }),
});

export type TokenLocation = z.infer<typeof TokenLocationSchema>;
