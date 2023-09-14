import { CSSProperties } from "react";
import { EdgeMarkerType, EdgeTypes, NodeTypes } from "reactflow";

type addKeys<T, NewKeys extends keyof T> = T & { [key in NewKeys]: T[keyof T] };
type erNodes =
  | "entity"
  | "entity-attribute"
  | "composite-attribute"
  | "relationship"
  | "relationship-attribute"
  | "aggregation";

type ErNodeTypes = addKeys<NodeTypes, erNodes>;
type ErEdgeTypes = addKeys<EdgeTypes, "erEdge">;

export type ErNotation = {
  nodeTypes: ErNodeTypes;
  edgeTypes: ErEdgeTypes;
  edgeMarkers: (
    cardinality: string,
    isTotalParticipation: boolean,
  ) => {
    style?: CSSProperties;
    markerStart?: EdgeMarkerType;
    markerEnd?: EdgeMarkerType;
  };
};
