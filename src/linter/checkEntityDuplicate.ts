import { ER } from "../types/parser/ER";
import { EntityDuplicateError } from "../types/linter/SemanticError";

export const checkEntityDuplicate = (er: ER): EntityDuplicateError[] => {
  const errors: EntityDuplicateError[] = [];

  const entityNameFrequency = new Map<string, number>();
  for (const entity of er.entities) {
    const name = entity.name;
    if (entityNameFrequency.has(name)) {
      entityNameFrequency.set(name, entityNameFrequency.get(name)! + 1);
    } else {
      entityNameFrequency.set(name, 1);
    }
  }

  for (const [name, freq] of entityNameFrequency) {
    if (freq > 1) {
      // find the last entity with this name
      const lastEntity = er.entities.filter((e) => e.name === name).pop()!;
      errors.push({
        type: "ENTITY_DUPLICATE",
        entityName: name,
        location: lastEntity.location,
      });
    }
  }

  return errors;
};
