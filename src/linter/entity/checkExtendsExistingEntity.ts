import { ER } from "../../types/parser/ER";
import { EntityExtendsNonExistentEntityError } from "../../types/linter/SemanticError";

/**
 * Finds entities that extend an entity that doesn't exist in an ER object
 * @param {ER} er - The ER object to lint
 * @return {EntityExtendsNonExistentEntityError[]} An array of errors for each entity that extends a non-existent entity
 */
export const checkEntityExtendsNonExistentEntity = (
  er: ER,
): EntityExtendsNonExistentEntityError[] => {
  const errors: EntityExtendsNonExistentEntityError[] = [];
  for (const entity of er.entities) {
    if (!entity.hasParent) continue;
    const parent = er.entities.find((e) => e.name === entity.parentName);
    if (!parent)
      errors.push({
        type: "ENTITY_EXTENDS_NON_EXISTENT_ENTITY",
        entityName: entity.name,
        extendsEntityName: entity.parentName!,
        location: entity.location,
      });
  }

  return errors;
};
