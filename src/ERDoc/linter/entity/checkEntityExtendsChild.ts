import { ER } from "../../types/parser/ER";
import { EntityExtendsChildEntityError } from "../../types/linter/SemanticError";

const pushToMapArr = <K, V>(map: Map<K, V[]>, key: K, value: V) => {
  if (map.has(key)) {
    map.get(key)!.push(value);
  } else {
    map.set(key, [value]);
  }
};

const findCycles = (graph: Map<string, string[]>) => {
  const visited = new Set<string>();
  const cycles = [];

  for (const start of graph.keys()) {
    if (visited.has(start)) continue;
    const localVisited = new Set<string>();
    const queue: string[] = [];
    const foundCycles = [];

    visited.add(start);
    queue.push(start);

    while (queue.length > 0) {
      const currNode = queue.shift()!;
      visited.add(currNode);
      localVisited.add(currNode);
      const adj = graph.get(currNode);
      if (!adj) continue;
      for (const nod of adj) {
        if (localVisited.has(nod)) {
          // found a cycle
          foundCycles.push({
            start,
            end: currNode,
          });
        } else {
          localVisited.add(nod);
          visited.add(nod);
          queue.push(nod);
        }
      }
    }
    cycles.push(...foundCycles);
  }
  return cycles;
};

/**
 * Finds entities that extend a child entity in an ER object
 * @param {ER} er - The ER object to lint
 * @return {EntityExtendsChildEntityError[]} An array of errors for each entity that extends a child entity
 */
export const checkEntityExtendsChildEntity = (
  er: ER,
): EntityExtendsChildEntityError[] => {
  const errors: EntityExtendsChildEntityError[] = [];
  const inheritanceGraph = new Map<string, string[]>();

  // build inheritance graph
  for (const entity of er.entities) {
    if (!entity.hasParent) continue;
    pushToMapArr(inheritanceGraph, entity.parentName!, entity.name);
  }

  const cycles = findCycles(inheritanceGraph);

  for (const { start, end } of cycles) {
    const entity = er.entities.find((e) => e.name === start)!;
    errors.push({
      type: "ENTITY_EXTENDS_CHILD_ENTITY",
      parentEntityName: start,
      childEntityName: end,
      location: entity.location,
    });
  }

  return errors;
};
