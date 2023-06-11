import { Entity, EntitySchema } from "./Entity"
import { Relationship, RelationshipSchema } from "./Relationship"
import { z } from "zod"

export const ERSchema = z.object({
    entities: z.array(EntitySchema),
    relationships: z.array(RelationshipSchema),
})

export type ER = z.infer<typeof ERSchema>