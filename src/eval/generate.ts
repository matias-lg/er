import * as crypto from "crypto";
import * as fs from "fs";

const N_ENTITIES = 1000;
const N_RELATIONS = 500;
const N_AGGREGATIONS = 100;

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

function createRelation(participantNames: string[]) {
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

const EntityNames = new Set<string>();
const RelationNames = new Set<string>();
const AggregationNames = new Set<string>();

let erDocument = "";

for (let i = 0; i < N_ENTITIES; i++) {
  const [entityName, entityStr] = createEntity();
  EntityNames.add(entityName);
  erDocument += entityStr;
}

for (let i = 0; i < N_RELATIONS; i++) {
  const n_participants = Math.floor(Math.random() * 3) + 2;
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
  const [relationName, relationStr] = createRelation(participantNames);
  RelationNames.add(relationName);
  erDocument += relationStr;
}

const encapsulated = new Set<string>();
for (let i = 0; i < N_AGGREGATIONS; i++) {
  let already = true;
  while (already) {
    const relationName =
      Array.from(RelationNames)[Math.floor(Math.random() * RelationNames.size)];
    if (!encapsulated.has(relationName)) {
      already = false;
      encapsulated.add(relationName);
      const aggregationStr = createAggregation(relationName);
      AggregationNames.add(aggregationStr);
      erDocument += aggregationStr;
    }
  }
}

const filename = process.argv[2];
if (!filename) {
  console.error("need filename");
  process.exit(1);
}
fs.writeFileSync(filename, erDocument);

console.log(erDocument);
