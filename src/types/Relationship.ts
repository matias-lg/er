import { z } from "zod";

const RelationshipAttributeSchema = z.object({
  name: z.string(),
  isComposite: z.boolean(),
  childAttributesNames: z.array(z.string()).nullable(),
});

const simpleRelationParticipantSchema = z.object({
      entityName: z.string(),
      isComposite: z.literal(false),
      cardinality: z.string(), // Permitir solo numeros y caracteres como "N" o "M"? 
      participation: z.union([z.literal("total"), z.literal("partial")]),
    })

const CompositeRelationParticipantSchema = z.object({
  entityName: z.string(),
  isComposite: z.literal(true),
  childParticipants: z.array(simpleRelationParticipantSchema)
})


export const RelationshipSchema = z.object({
  type: z.literal("relationship"),
  name: z.string(),
  attributes: z.array(RelationshipAttributeSchema),
  participantEntities: z.array(
    z.union([simpleRelationParticipantSchema, CompositeRelationParticipantSchema])
  ),
});

export type Relationship = z.infer<typeof RelationshipSchema>;
