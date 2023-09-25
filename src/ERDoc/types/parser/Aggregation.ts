import { TokenLocation } from "./TokenLocation";

export type Aggregation = {
  type: "aggregation";
  name: string;
  aggregatedRelationshipName: string;
  location: TokenLocation;
};
