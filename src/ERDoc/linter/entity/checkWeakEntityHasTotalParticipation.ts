import { ER } from "../../types/parser/ER";
import { WeakEntityWrongConstraintsError } from "../../types/linter/SemanticError";
import { simpleRelationParticipant } from "../../types/parser/Relationship";

const hasCorrectConstraints = (entity: simpleRelationParticipant) => {
  return entity.participation === "total" && entity.cardinality === "1";
};

/**
 * Finds weak entities that don't have both total participation and cardinality of 1, in their identifying relationship in an ER object
 * @param {ER} er - The ER object to lint
 * @return {WeakEntityWrongConstraintsError[]} An array of errors for each weak entity that doesn't have total participation in its identifying relationship
 */
export const checkWeakEntityConstraints = (
  er: ER,
): WeakEntityWrongConstraintsError[] => {
  const errors: WeakEntityWrongConstraintsError[] = [];
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
        /* entity is composite, every role must satisfy the constraints */
        (entityInRelationship.isComposite &&
          entityInRelationship.childParticipants.every(hasCorrectConstraints)) ||
        /* entity is not composite and has total participation */
        (!entityInRelationship.isComposite &&
          hasCorrectConstraints(entityInRelationship))
      )
        continue;

      errors.push({
        type: "WEAK_ENTITY_WRONG_CONSTRAINTS",
        entityName: entity.name,
        relationshipName: identifyingRelationship.name,
        location: entityInRelationship.location,
      });
    }
  }
  return errors;
};
