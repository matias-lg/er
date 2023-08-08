import { z } from "zod";
import { TokenLocationSchema } from "./TokenLocation";

const EntityAttributeSchema = z.object({
    name: z.string(),
    isKey: z.boolean(),
    isComposite: z.boolean(),
    childAttributesNames: z.array(z.string()).nullable(),
    location: TokenLocationSchema
});

export const EntitySchema = z.object({
    type: z.literal("entity"),
    name: z.string(),
    attributes: z.array(EntityAttributeSchema),
    hasParent: z.boolean(),
    parentName: z.string().nullable(),
    hasDependencies: z.boolean(),
    dependsOn: z.object({
        relationshipName: z.string(),
    }).nullable(),
    location: TokenLocationSchema
});

export type Entity = z.infer<typeof EntitySchema>;