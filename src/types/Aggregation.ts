import { z } from "zod";


export const AggregationSchema = z.object({
    type: z.literal("aggregation"),
    name: z.string(),
    aggregatedRelationshipName: z.string(),
});

export type Aggregation = z.infer<typeof AggregationSchema >;
