import { TokenLocation } from "./TokenLocation";

type RelationshipAttribute = {
  name: string;
  isComposite: boolean;
  childAttributesNames: string[] | null;
  location: TokenLocation;
};

export type simpleRelationParticipant = {
  entityName: string;
  isComposite: false;
  cardinality: string;
  participation: "total" | "partial";
  location: TokenLocation;
};

export type CompositeRelationParticipant = {
  entityName: string;
  isComposite: true;
  childParticipants: simpleRelationParticipant[];
  location: TokenLocation;
};

export type Relationship = {
  type: "relationship";
  name: string;
  attributes: RelationshipAttribute[];
  participantEntities: (
    | simpleRelationParticipant
    | CompositeRelationParticipant
  )[];
  location: TokenLocation;
};
