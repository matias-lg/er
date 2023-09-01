import { ER } from "../../types/parser/ER";
import { EntityDuplicateAttributeError } from "../../types/linter/SemanticError";

/**
 * Finds duplicate attributes in entities in an ER object
 * @param {ER} er - The ER object to lint
 * @return {EntityDuplicateAttributeError[]} An array of errors for each duplicate attribute
 */
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
          type: "ENTITY_DUPLICATE_ATTRIBUTE",
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
  let currentEntity = er.entities.filter((e) => e.name === entityName).pop()!;
  const entityAttributes = currentEntity.attributes.map((attr) => ({
    isFromParent: false,
    ...attr,
  }));

  if (!currentEntity.hasParent) return entityAttributes;
  let hasParent = true;
  while (hasParent) {
    // assume only one parent, more than 1 would be an error caught by another validator
    const parent = er.entities.filter(
      (e) => e.name === currentEntity.parentName,
    );
    if (parent.length === 0) break;
    // if it reaches itself it's a circular inheritance. WRONG.
    if (parent[0].name === entityName) return [];

    parent[0].attributes.forEach((attr) => {
      entityAttributes.push({
        isFromParent: true,
        ...attr,
      });
    });

    currentEntity = parent[0];
    hasParent = currentEntity.hasParent;
  }
  return entityAttributes;
};
