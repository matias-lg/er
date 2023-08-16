import { TokenLocation } from "../parser/TokenLocation";

export type EntityDuplicateError = {
  type: "ENTITY_DUPLICATE";
  entityName: string;
  location: TokenLocation;
};

export type EntityDuplicateAttributeError = {
  type: "ENTITY_DUPLICATE_ATTRIBUTE";
  entityName: string;
  attributeName: string;
  location: TokenLocation;
};

export type EntityNoPrimaryKeyError = {
  type: "ENTITY_NO_PRIMARY_KEY";
  entityName: string;
  location: TokenLocation;
};

export type EntityExtendsNonExistentEntityError = {
  type: "ENTITY_EXTENDS_NON_EXISTENT_ENTITY";
  entityName: string;
  extendsEntityName: string;
  location: TokenLocation;
};

export type ChildEntityHasKeyError = {
  type: "CHILD_ENTITY_HAS_KEY";
  entityName: string;
  location: TokenLocation;
};

export type WeakEntityDependsOnNonExistentRelationshipError = {
  type: "WEAK_ENTITY_DEPENDS_ON_NON_EXISTENT_RELATIONSHIP";
  entityName: string;
  relationshipName: string;
  location: TokenLocation;
};

export type WeakEntityNotInRelationshipError = {
  type: "WEAK_ENTITY_NOT_IN_RELATIONSHIP";
  entityName: string;
  relationshipName: string;
  location: TokenLocation;
};

export type WeakEntityNotTotalParticipationError = {
  type: "WEAK_ENTITY_NOT_TOTAL_PARTICIPATION";
  entityName: string;
  relationshipName: string;
  location: TokenLocation;
};

export type RelationshipDuplicateError = {
  type: "RELATIONSHIP_DUPLICATE";
  relationshipName: string;
  location: TokenLocation;
};

export type RelationshipDuplicateAttributeError = {
  type: "RELATIONSHIP_DUPLICATE_ATTRIBUTE";
  relationshipName: string;
  attributeName: string;
  location: TokenLocation;
};

export type RelationshipLessThanTwoParticipatingEntitiesError = {
  type: "RELATIONSHIP_LESS_THAN_TWO_PARTICIPATING_ENTITIES";
  relationshipName: string;
  location: TokenLocation;
};

export type RelationshipParticipatingEntityNotExists = {
  type: "RELATIONSHIP_PARTICIPATING_ENTITY_NOT_EXISTS";
  relationshipName: string;
  entityName: string;
  location: TokenLocation;
};

export type RelationshipDuplicateParticipantError = {
  type: "RELATIONSHIP_DUPLICATE_PARTICIPANT";
  relationshipName: string;
  entityName: string;
  location: TokenLocation;
};

export type AggregationDuplicateError = {
  type: "AGGREGATION_DUPLICATE";
  aggregationName: string;
  location: TokenLocation;
};

export type SemanticError =
  | EntityDuplicateError
  | EntityDuplicateAttributeError
  | EntityNoPrimaryKeyError
  | EntityExtendsNonExistentEntityError
  | ChildEntityHasKeyError
  | WeakEntityDependsOnNonExistentRelationshipError
  | WeakEntityNotInRelationshipError
  | WeakEntityNotTotalParticipationError
  | RelationshipDuplicateError
  | RelationshipDuplicateAttributeError
  | RelationshipLessThanTwoParticipatingEntitiesError
  | RelationshipParticipatingEntityNotExists
  | RelationshipDuplicateParticipantError
  | AggregationDuplicateError;
