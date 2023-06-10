export type RelationshipAttribute = {
    name: string;
    isMultiValued: boolean;
    childAttributesNames: string[] | null;
}

export type Relationship = {
   type: "relationship"; 
   name: string;
   participantEntities: {
         entityName: string;
         cardinality: string; //TODO: quizás un mejor tipo: strings numéricos o letras mayúsculas de un caracter
         participation: "total" | "partial";
   }[];
   attributes: RelationshipAttribute[];
}