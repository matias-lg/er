import { TokenLocation } from "./TokenLocation";

type EntityAttribute = {
  name: string;
  isKey: boolean;
  isComposite: boolean;
  childAttributesNames: string[] | null;
  location: TokenLocation;
};

export type Entity = {
  type: "entity";
  name: string;
  attributes: EntityAttribute[];
  hasParent: boolean;
  parentName: string | null;
  hasDependencies: boolean;
  dependsOn: {
    relationshipName: string;
  } | null;
  location: TokenLocation;
};
