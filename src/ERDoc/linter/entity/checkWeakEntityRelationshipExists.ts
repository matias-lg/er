import { ER } from "../../types/parser/ER";
import { WeakEntityDependsOnNonExistentRelationshipError } from "../../types/linter/SemanticError";

/**
 * Finds weak entities which identifying relationship doesn't exist in an ER object
 * @param {ER} er - The ER object to lint
 * @return { WeakEntityDependsOnNonExistentRelationshipError[]} An array of errors for each weak entity which identifying relationship doesn't exist
 */
export const checkWeakEntityRelationshipExists = (
  er: ER,
): WeakEntityDependsOnNonExistentRelationshipError[] => {
  const errors: WeakEntityDependsOnNonExistentRelationshipError[] = [];
  for (const entity of er.entities) {
    if (!entity.hasDependencies) continue;
    if (
      er.relationships.filter(
        (rel) => rel.name === entity.dependsOn?.relationshipName,
      ).length === 0
    )
      errors.push({
        type: "WEAK_ENTITY_DEPENDS_ON_NON_EXISTENT_RELATIONSHIP",
        entityName: entity.name,
        relationshipName: entity.dependsOn!.relationshipName,
        location: entity.location,
      });
  }
  return errors;
};
