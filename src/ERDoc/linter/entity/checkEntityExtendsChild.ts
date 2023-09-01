import { ER } from "../../types/parser/ER";
import { EntityExtendsChildEntityError } from "../../types/linter/SemanticError";

/**
 * Finds entities that extend a child entity in an ER object
 * @param {ER} er - The ER object to lint
 * @return {EntityExtendsChildEntityError[]} An array of errors for each entity that extends a child entity
 */
export const checkEntityExtendsChildEntity = (
  er: ER,
): EntityExtendsChildEntityError[] => {
  const errors: EntityExtendsChildEntityError[] = [];
  const inheritsFrom = new Map<string, string[]>();
  for (const entity of er.entities) {
    if (inheritsFrom.has(entity.name)) {
      const parentInMap = inheritsFrom
        .get(entity.name)!
        .find((name) => name === entity.parentName);
      if (parentInMap !== undefined)
        errors.push({
          type: "ENTITY_EXTENDS_CHILD_ENTITY",
          parentEntityName: entity.name,
          childEntityName: entity.parentName!,
          location: entity.location,
        });
    }

    if (!entity.hasParent) continue;
    let parent = er.entities.find((e) => e.name === entity.parentName);
    while (parent !== undefined && parent.name !== entity.name) {
      // parent can't be in my childs
      const myChilds = inheritsFrom.get(entity.name);
      if (myChilds !== undefined) {
        const parentInMyChilds = myChilds.find((name) => name === parent!.name);
        if (parentInMyChilds !== undefined) break;
      }

      if (inheritsFrom.has(parent.name)) {
        inheritsFrom.get(parent.name)!.push(entity.name);
      } else {
        inheritsFrom.set(parent.name, [entity.name]);
      }
      parent = er.entities.find((e) => e.name === parent!.parentName);
    }
  }

  return errors;
};
