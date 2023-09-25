import { Entity } from "./Entity";
import { Relationship } from "./Relationship";
import { Aggregation } from "./Aggregation";

export type ER = {
  entities: Entity[];
  relationships: Relationship[];
  aggregations: Aggregation[];
};
