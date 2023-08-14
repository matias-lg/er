import { ER } from "../types/parser/ER";
import { ChildEntityHasKeyError } from "../types/linter/SemanticError";

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
