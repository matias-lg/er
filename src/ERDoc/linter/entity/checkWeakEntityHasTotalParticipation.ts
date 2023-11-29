import { ER } from "../../types/parser/ER";
import { WeakEntityNotTotalParticipationError } from "../../types/linter/SemanticError";

/**
 * Finds weak entities that don't have total participation in their identifying relationship in an ER object
 * @param {ER} er - The ER object to lint
 * @return {WeakEntityNotTotalParticipationError[]} An array of errors for each weak entity that doesn't have total participation in its identifying relationship
 */
export const checkWeakEntityHasTotalParticipation = (
  er: ER,
): WeakEntityNotTotalParticipationError[] => {
  const errors: WeakEntityNotTotalParticipationError[] = [];
  for (const entity of er.entities) {
    if (!entity.hasDependencies) continue;
    // check if relationship exists
    for (const dep of entity.dependsOn!.relationshipName) {
      const identifyingRelationship = er.relationships.find(
        (rel) => rel.name === dep,
      );
      if (identifyingRelationship === undefined) continue;

      // check if entity is in relationship
      const entityInRelationship =
        identifyingRelationship.participantEntities.find(
          (part) => part.entityName === entity.name,
        );
      if (entityInRelationship === undefined) continue;

      // finally check if entity has total participation
      if (
        /* entity is composite,at least 1 child has total participation */
        (entityInRelationship.isComposite &&
          entityInRelationship.childParticipants.some(
            (child) => child.participation === "total",
          )) ||
        /* entity is not composite and has total participation */
        (!entityInRelationship.isComposite &&
          entityInRelationship.participation === "total")
      )
        continue;

      errors.push({
        type: "WEAK_ENTITY_NOT_TOTAL_PARTICIPATION",
        entityName: entity.name,
        relationshipName: identifyingRelationship.name,
        location: entityInRelationship.location,
      });
    }
  }
  return errors;
};
