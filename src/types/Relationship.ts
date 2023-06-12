import { z } from "zod";

export const RelationshipAttributeSchema = z.object({
  name: z.string(),
  isMultivalued: z.boolean(),
  childAttributesNames: z.array(z.string()).nullable(),
});

export const RelationshipSchema = z.object({
  type: z.literal("relationship"),
  name: z.string(),
  attributes: z.array(RelationshipAttributeSchema),
  participantEntities: z.array(
    z.object({
      entityName: z.string(),
      cardinality: z.string().max(1), // Permitir solo numeros y caracteres como "N" o "M"? 
      participation: z.union([z.literal("total"), z.literal("partial")]),
    })
  ),
});

export type Relationship = z.infer<typeof RelationshipSchema>;
export type RelationshipAttribute = z.infer<typeof RelationshipAttributeSchema>;