import { ER } from "../../types/parser/ER";
import { ChildEntityHasKeyError } from "../../types/linter/SemanticError";

/**
 * Finds child entities that have a primary key in an ER object
 * @param {ER} er - The ER object to lint
 * @return {ChildEntityHasKeyError[]} An array of errors for each child entity with a key
 */
export const checkChildEntityHasKey = (er: ER): ChildEntityHasKeyError[] => {
  const errors: ChildEntityHasKeyError[] = [];
  for (const entity of er.entities) {
    if (!entity.hasParent) continue;
    const hasKeyAttribute = entity.attributes.some((attr) => attr.isKey);
    if (hasKeyAttribute)
      errors.push({
        type: "CHILD_ENTITY_HAS_KEY",
        entityName: entity.name,
        location: entity.location,
      });
  }
  return errors;
};
