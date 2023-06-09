export type EntityAttribute = {
    name: string;
    isKey: boolean;
    isMultivalued: boolean;
    childAttributesNames: string[] | null;
}

export type Entity = {
    type: "entity";
    name: string;
    attributes: EntityAttribute[];
    hasParent: boolean;
    parentName: string | null;
    hasDependencies: boolean;
    dependsOn: { "entityName": string, "attributeName": string } | null;
}