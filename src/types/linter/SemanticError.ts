import { TokenLocation } from "../parser/TokenLocation";

export enum SemanticErrorType {
  /* Entity */
  ENTITY_DUPLICATE,
  ENTITY_DUPLICATE_ATTRIBUTE,
  ENTITY_NO_PRIMARY_KEY,

  /* Entity that extends */
  ENTITY_EXTENDS_NON_EXISTENT_ENTITY,

  /* Weak entity*/
  WEAK_ENTITY_DEPENDS_ON_NON_EXISTENT_RELATIONSHIP,
  WEAK_ENTITY_NOT_IN_RELATIONSHIP,
  WEAK_ENTITY_NOT_TOTAL_PARTICIPATION,

  /* Relationships */
  RELATIONSHIP_DUPLICATE,
  RELATIONSHIP_DUPLICATE_ATTRIBUTE,
  RELATIONSHIP_LESS_THAN_TWO_PARTICIPANTS,
  RELATIONSHIP_PARTICIPANT_NON_EXISTENT_ENTITY,
  RELATIONSHIP_DUPLICATE_PARTICIPANT,

    /* Aggregation */
    AGGREGATION_DUPLICATE,
    AGGREGATION_NON_EXISTENT_RELATIONSHIP,
}

export type EntityDuplicateError = {
    type: SemanticErrorType.ENTITY_DUPLICATE;
    entityName: string;
    location: TokenLocation;
}

export type EntityDuplicateAttributeError = {
    type: SemanticErrorType.ENTITY_DUPLICATE_ATTRIBUTE;
    entityName: string;
    attributeName: string;
    location: TokenLocation;
}

export type SemanticError =
    EntityDuplicateError
    | EntityDuplicateAttributeError

