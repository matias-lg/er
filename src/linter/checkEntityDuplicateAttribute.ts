import { ER } from "../types/parser/ER";
import { SemanticErrorType } from "../types/linter/SemanticError";
import { EntityDuplicateAttributeError } from "../types/linter/SemanticError";

export const checkEntityDuplicateAttribute = (
  er: ER
): EntityDuplicateAttributeError[] => {
  const errors: EntityDuplicateAttributeError[] = [];

  for (const entity of er.entities) {
    const attributeNameFrequency = new Map<string, number>();
    for (const attribute of entity.attributes) {
      const name = attribute.name;
      if (attributeNameFrequency.has(name))
        attributeNameFrequency.set(name, attributeNameFrequency.get(name)! + 1);
      else attributeNameFrequency.set(name, 1);
    }

    for (const [attrName, freq] of attributeNameFrequency) {
      if (freq > 1) {
        const lastAttribute = entity.attributes
          .filter((e) => e.name === attrName)
          .pop()!;
        errors.push({
          type: SemanticErrorType.ENTITY_DUPLICATE_ATTRIBUTE,
          entityName: entity.name,
          attributeName: attrName,
          location: lastAttribute.location,
        });
      }
    }
  }

  return errors;
};
