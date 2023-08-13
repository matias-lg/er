import { ER } from "../types/parser/ER";
import { EntityNoPrimaryKeyError } from "../types/linter/SemanticError";

export const checkEntityNoPrimaryKey = (er: ER): EntityNoPrimaryKeyError[] => {
  const errors: EntityNoPrimaryKeyError[] = [];
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
        type: "ENTITY_NO_PRIMARY_KEY",
        entityName: entity.name,
        location: entity.location,
      });
  }

  return errors;
};
