import { ER } from "../../types/parser/ER";
import { WeakEntityNotInRelationshipError } from "../../types/linter/SemanticError";

/**
 * Finds weak entities that participate in their identifying relationship in an ER object
 * @param {ER} er - The ER object to lint
 * @return {WeakEntityNotInRelationshipError[]} An array of errors for each weak entity that doesn't participate in its identifying relationship
 */
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
        type: "WEAK_ENTITY_NOT_IN_RELATIONSHIP",
        entityName: entity.name,
        relationshipName: entity.dependsOn!.relationshipName,
        location: entity.location,
      });
  }
  return errors;
};
