import { EntitySchema } from "./Entity";
import { RelationshipSchema } from "./Relationship";
import { AggregationSchema } from "./Aggregation";
import { z } from "zod";

export const ERSchema = z.object({
  entities: z.array(EntitySchema),
  relationships: z.array(RelationshipSchema),
  aggregations: z.array(AggregationSchema),
});

export type ER = z.infer<typeof ERSchema>;
