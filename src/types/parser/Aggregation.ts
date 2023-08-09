import { z } from "zod";
import { TokenLocationSchema } from "./TokenLocation";


export const AggregationSchema = z.object({
    type: z.literal("aggregation"),
    name: z.string(),
    aggregatedRelationshipName: z.string(),
    location: TokenLocationSchema
});

export type Aggregation = z.infer<typeof AggregationSchema >;
