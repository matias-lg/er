import { ER } from "../../types/parser/ER";
import { EntityHasNoKeyError } from "../../types/linter/SemanticError";

/**
 * Finds entities without key attributes in an ER object
 * @param {ER} er - The ER object to lint
 * @return {EntityHasNoKeyError[]} An array of errors for each entity without a key
 */
export const checkEntityNoKey = (er: ER): EntityHasNoKeyError[] => {
  const errors: EntityHasNoKeyError[] = [];
  for (const entity of er.entities) {
    let hasKey = entity.attributes.some((attr) => attr.isKey);

    // check if parents have a key
    let hasParent = entity.hasParent;
    let parentName = entity.parentName;
    let parent = er.entities.filter((e) => e.name === parentName!)[0];
    while (
      parent != null &&
      hasParent &&
      !hasKey &&
      /* protect against a *wrong* circular inheritance*/ parentName !=
        entity.name
    ) {
      parent = er.entities.filter((e) => e.name === parentName!)[0];
      hasParent = parent.hasParent;
      parentName = parent.parentName;
      hasKey = parent.attributes.some((attr) => attr.isKey);
    }

    if (!hasKey)
      errors.push({
        type: "ENTITY_HAS_NO_KEY",
        entityName: entity.name,
        location: entity.location,
      });
  }

  return errors;
};
