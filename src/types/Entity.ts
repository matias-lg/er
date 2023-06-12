import { z } from "zod";

const EntityAttributeSchema = z.object({
    name: z.string(),
    isKey: z.boolean(),
    isMultivalued: z.boolean(),
    childAttributesNames: z.array(z.string()).nullable(),
});

export const EntitySchema = z.object({
    type: z.literal("entity"),
    name: z.string(),
    attributes: z.array(EntityAttributeSchema),
    hasParent: z.boolean(),
    parentName: z.string().nullable(),
    hasDependencies: z.boolean(),
    dependsOn: z.object({
        entityName: z.string(),
        relationshipName: z.string(),
    }).nullable(),
});

export type Entity = z.infer<typeof EntitySchema>;