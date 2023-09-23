import { CSSProperties } from "react";
import { EdgeMarkerType, EdgeTypes, NodeTypes } from "reactflow";
import { Node, Edge } from "reactflow";

export type EntityNode = Node<
  {
    label: string;
    isWeak: boolean;
  },
  "entity"
>;

export type EntityAttributeNode = Node<
  {
    label: string;
    isKey: boolean;
    entityIsWeak: boolean;
  },
  "entity-attribute"
>;

export type CompositeAttributeNode = Node<
  { label: string },
  "composite-attribute"
>;

export type RelationshipNode = Node<
  {
    label: string;
    hasDependant: boolean;
  },
  "relationship"
>;

export type RelationshipAttributeNode = Node<
  {
    label: string;
  },
  "relationship-attribute"
>;

export type AggregationNode = Node<
  {
    label: string;
    width?: number;
    height?: number;
  },
  "aggregation"
>;

export type IsANode = Node<Record<string, never>, "isA">;

export type EntityEdge = Edge<{
  cardinality: string;
  isTotalParticipation: boolean;
}>;

export type ErNode =
  | EntityNode
  | EntityAttributeNode
  | CompositeAttributeNode
  | RelationshipNode
  | RelationshipAttributeNode
  | AggregationNode;

type addKeys<T, NewKeys extends keyof T> = T & { [key in NewKeys]: T[keyof T] };
type erTypes =
  | "entity"
  | "entity-attribute"
  | "composite-attribute"
  | "relationship"
  | "relationship-attribute"
  | "aggregation";

type ErNodeTypes = addKeys<NodeTypes, erTypes>;
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
