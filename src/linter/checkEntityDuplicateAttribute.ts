import { ER } from "../types/parser/ER";
import { SemanticErrorType } from "../types/linter/SemanticError";
import { EntityDuplicateAttributeError } from "../types/linter/SemanticError";

export const checkEntityDuplicateAttribute = (
  er: ER,
): EntityDuplicateAttributeError[] => {
  const errors: EntityDuplicateAttributeError[] = [];

  for (const entity of er.entities) {
    const attributeNameFrequency = new Map<string, number>();
    const entityAttributes = getAllAttributes(entity.name, er);

    for (const attribute of entityAttributes) {
      const name = attribute.name;
      if (attributeNameFrequency.has(name))
        attributeNameFrequency.set(name, attributeNameFrequency.get(name)! + 1);
      else attributeNameFrequency.set(name, 1);
    }

    for (const [attrName, freq] of attributeNameFrequency) {
      if (freq > 1) {
        const lastAttribute = entityAttributes
          .filter((e) => e.name === attrName && !e.isFromParent)
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

const getAllAttributes = (entityName: string, er: ER) => {
  let entity = er.entities.filter((e) => e.name === entityName).pop()!;
  const entityAttributes = entity.attributes.map((attr) => ({
    isFromParent: false,
    ...attr,
  }));

  if (!entity.hasParent) return entityAttributes;
  let hasParent = true;
  while (hasParent) {
    // assume only one parent, more than 1 would be an error caught by another validator
    const parent = er.entities.filter((e) => e.name === entity.parentName);
    if (parent.length === 0) break;

    parent[0].attributes.forEach((attr) => {
      entityAttributes.push({
        isFromParent: true,
        ...attr,
      });
    });

    entity = parent[0];
    hasParent = entity.hasParent;
  }
  return entityAttributes;
};
