import { ER } from "../types/parser/ER";
import {
  WeakEntityNotInRelationshipError,
  SemanticErrorType,
} from "../types/linter/SemanticError";

export const checkWeakEntityInRelationship = (
  er: ER,
): WeakEntityNotInRelationshipError[] => {
  const errors: WeakEntityNotInRelationshipError[] = [];
  for (const entity of er.entities) {
    if (!entity.hasDependencies) continue;
    const relationship = er.relationships.find(
      (r) => r.name === entity.dependsOn!.relationshipName,
    );
    if (relationship === undefined) continue;
    const relationshipParticipants = relationship.participantEntities.map(
      (p) => p.entityName,
    );
    if (relationshipParticipants.find((p) => p === entity.name) === undefined)
      errors.push({
        type: SemanticErrorType.WEAK_ENTITY_NOT_IN_RELATIONSHIP,
        entityName: entity.name,
        relationshipName: entity.dependsOn!.relationshipName,
        location: entity.location,
      });
  }
  return errors;
};
