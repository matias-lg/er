import { z } from "zod";
import { TokenLocationSchema } from "./TokenLocation";

const RelationshipAttributeSchema = z.object({
  name: z.string(),
  isComposite: z.boolean(),
  childAttributesNames: z.array(z.string()).nullable(),
  location: TokenLocationSchema
});

const simpleRelationParticipantSchema = z.object({
      entityName: z.string(),
      isComposite: z.literal(false),
      cardinality: z.string(), // Permitir solo numeros y caracteres como "N" o "M"? 
      participation: z.union([z.literal("total"), z.literal("partial")]),
      location: TokenLocationSchema
    })

const CompositeRelationParticipantSchema = z.object({
  entityName: z.string(),
  isComposite: z.literal(true),
  childParticipants: z.array(simpleRelationParticipantSchema),
  location: TokenLocationSchema
})


export const RelationshipSchema = z.object({
  type: z.literal("relationship"),
  name: z.string(),
  attributes: z.array(RelationshipAttributeSchema),
  participantEntities: z.array(
    z.union([simpleRelationParticipantSchema, CompositeRelationParticipantSchema])
  ),
  location: TokenLocationSchema
});

export type Relationship = z.infer<typeof RelationshipSchema>;