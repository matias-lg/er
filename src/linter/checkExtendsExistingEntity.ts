import { ER } from "../types/parser/ER";
import { EntityExtendsNonExistentEntityError } from "../types/linter/SemanticError";

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
