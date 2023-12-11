import * as crypto from "crypto";
import * as fs from "fs";
import { n } from "nextra/dist/types-c8e621b7";

const gen = () => crypto.randomBytes(5).toString("hex");

function createEntity() {
  const entityName = gen();
  let entityStr = `entity ${entityName} {\n`;

  const numberOfKeys = Math.floor(Math.random() * 2) + 1;
  const numberOfAttributes = Math.floor(Math.random() * 4) + 1;
  for (let i = 0; i < numberOfAttributes - numberOfKeys; i++) {
    const attr = gen();
    entityStr += `\t${attr}\n`;
  }

  for (let i = 0; i < numberOfKeys; i++) {
    const attr = gen();
    entityStr += `\t${attr} key\n`;
  }

  entityStr += "}\n";
  return [entityName, entityStr] as const;
}

function createSubclass(superClassName: string) {
  const subclassName = gen();
  let subclassStr = `entity ${subclassName} extends ${superClassName} {\n`;
  const numberOfAttributes = Math.floor(Math.random() * 4) + 1;
  for (let i = 0; i < numberOfAttributes; i++) {
    const attr = gen();
    subclassStr += `\t${attr}\n`;
  }
  subclassStr += "}\n";
  return [subclassName, subclassStr] as const;
}

function createTree(rootName: string) {
  let treeStr = "";
  let n_entities = 0;
  let HEIGHT = 3;
  let parents = [rootName];
  while (HEIGHT > 0) {
    const nodesInLevel = Math.floor(Math.random() * 4) + 1;
    const newParents = [];
    for (let i = 0; i < nodesInLevel; i++) {
      // pick random parent
      const randomParent = parents[Math.floor(Math.random() * parents.length)];
      const [subclassName, subclassStr] = createSubclass(randomParent);
      n_entities++;
      newParents.push(subclassName);
      treeStr += subclassStr;
    }
    parents = newParents;
    HEIGHT--;
  }
  return [treeStr, n_entities] as const;
}

function createRelationship(participantNames: string[]) {
  const relationName = gen();
  let relationStr = `relation ${relationName} (${participantNames.join(
    ",",
  )}) {\n`;
  const numberOfAttributes = Math.floor(Math.random() * 2) + 1;
  for (let i = 0; i < numberOfAttributes; i++) {
    const attr = gen();
    relationStr += `\t${attr}\n`;
  }
  relationStr += "}\n";
  return [relationName, relationStr] as const;
}

function createAggregation(relationName: string) {
  return `aggregation ${gen()} (${relationName})\n`;
}

function createErDoc(
  n_entities: number,
  n_relationships: number,
  n_aggregations: number,
  n_trees: number,
) {
  const EntityNames = new Set<string>();
  const RelationNames = new Set<string>();
  const AggregationNames = new Set<string>();

  let erDocument = "";

  for (let i = 0; i < n_entities; i++) {
    const [entityName, entityStr] = createEntity();
    EntityNames.add(entityName);
    erDocument += entityStr;
  }

  let n_tree_entities = 0;
  for (let i = 0; i < n_trees; i++) {
    const [treeStr, n_ents] = createTree(
      Array.from(EntityNames)[Math.floor(Math.random() * EntityNames.size)],
    );
    n_tree_entities += n_ents;
    erDocument += treeStr;
  }

  for (let i = 0; i < n_relationships; i++) {
    const n_participants = Math.min(
      Array.from(EntityNames).length,
      Math.floor(Math.random() * 3) + 2,
    );

    const participantNames: string[] = [];
    for (let j = 0; j < n_participants; j++) {
      let exists = true;
      while (exists) {
        const participantName =
          Array.from(EntityNames)[Math.floor(Math.random() * EntityNames.size)];
        if (!participantNames.includes(participantName)) {
          exists = false;
          participantNames.push(participantName);
        }
      }
    }

    const [relationName, relationStr] = createRelationship(participantNames);
    RelationNames.add(relationName);
    erDocument += relationStr;
  }

  const encapsulated = new Set<string>();
  for (let i = 0; i < n_aggregations; i++) {
    let already = true;
    while (already) {
      const relationName =
        Array.from(RelationNames)[
          Math.floor(Math.random() * RelationNames.size)
        ];
      if (!encapsulated.has(relationName)) {
        already = false;
        encapsulated.add(relationName);
        const aggregationStr = createAggregation(relationName);
        AggregationNames.add(aggregationStr);
        erDocument += aggregationStr;
      }
    }
  }
  const filename = `src/eval/reports/${n_entities}_${n_relationships}_${n_aggregations}.er`;
  fs.writeFileSync(filename, erDocument);

  return [n_entities + n_tree_entities, n_relationships, n_aggregations];
}

const testcases = [
  [2, 1, 0, 0],
  [3, 1, 0, 0],
  [5, 2, 1, 0],
  [7, 3, 1, 1],
  [9, 4, 1, 1],
  [10, 5, 1, 2],
  [15, 5, 1, 2],
  [20, 5, 1, 2],
  [25, 7, 2, 2],
  [30, 8, 2, 2],
  [35, 9, 2, 3],
  [40, 10, 2, 3],
  [45, 10, 2, 3],
  [50, 10, 2, 3],
  [55, 10, 2, 3],
  [60, 10, 2, 3],
  [65, 10, 2, 3],
  [70, 10, 2, 3],
  [75, 15, 3, 4],
  [100, 20, 5, 5],
] as const;

for (const [
  n_entities,
  n_relationships,
  n_aggregations,
  n_trees,
] of testcases) {
  console.log(`Creating ERdoc with:
    ${n_entities} Entities
    ${n_relationships} Relationships
    ${n_aggregations} Aggregations
    ${n_trees} Superclass/Subclass trees`);
  const [createdEnts, createdRels, createdAggs] = createErDoc(
    n_entities,
    n_relationships,
    n_aggregations,
    n_trees,
  );
  console.log(`Generated ${createdEnts}_${createdRels}_${createdAggs}
    ----------------------
  `);
}
