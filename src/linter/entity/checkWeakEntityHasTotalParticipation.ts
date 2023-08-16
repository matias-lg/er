import { ER } from "../../types/parser/ER";
import { WeakEntityNotTotalParticipationError } from "../../types/linter/SemanticError";

export const checkWeakEntityHasTotalParticipation = (
  er: ER,
): WeakEntityNotTotalParticipationError[] => {
  const errors: WeakEntityNotTotalParticipationError[] = [];
  for (const entity of er.entities) {
    if (!entity.hasDependencies) continue;
    // check if relationship exists
    const identifyingRelationship = er.relationships.find(
      (rel) => rel.name === entity.dependsOn!.relationshipName,
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
      /* entity is composite and every child has total participation */
      (entityInRelationship.isComposite &&
        entityInRelationship.childParticipants.every(
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
  return errors;
};
