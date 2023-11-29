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
    for (const dep of entity.dependsOn!.relationshipName) {
      if (er.relationships.filter((rel) => rel.name === dep).length === 0)
        errors.push({
          type: "WEAK_ENTITY_DEPENDS_ON_NON_EXISTENT_RELATIONSHIP",
          entityName: entity.name,
          relationshipName: dep,
          location: entity.location,
        });
    }
  }
  return errors;
};
