import { ER } from "../../types/parser/ER";
import { RelationshipDuplicateAttributeError } from "../../types/linter/SemanticError";

/**
 * Finds duplicate attributes in relationships in an ER object
 * @param {ER} er - The ER object to lint
 * @return {RelationshipDuplicateAttributeError[]} An array of errors for each duplicate relationship attribute
 */
export const checkRelationshipDuplicateAttribute = (
  er: ER,
): RelationshipDuplicateAttributeError[] => {
  const errors: RelationshipDuplicateAttributeError[] = [];
  for (const relationship of er.relationships) {
    const attributeNames = new Map<string, number>();

    for (const attr of relationship.attributes) {
      if (attributeNames.has(attr.name)) {
        attributeNames.set(attr.name, attributeNames.get(attr.name)! + 1);
      } else {
        attributeNames.set(attr.name, 1);
      }
    }

    for (const [attrName, freq] of attributeNames) {
      if (freq > 1) {
        const lastAttr = relationship.attributes
          .filter((attr) => attr.name === attrName)
          .pop()!;
        errors.push({
          type: "RELATIONSHIP_DUPLICATE_ATTRIBUTE",
          relationshipName: relationship.name,
          attributeName: attrName,
          location: lastAttr.location,
        });
      }
    }
  }

  return errors;
};
