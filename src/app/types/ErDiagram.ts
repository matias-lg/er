import { CSSProperties, ComponentType } from "react";
import { EdgeMarkerType, EdgeTypes, NodeProps } from "reactflow";
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
  | AggregationNode
  | IsANode;

type erNodeType<T extends NonNullable<N["type"]>, N extends ErNode> = {
  [key in T]: ComponentType<NodeProps<N["data"]>>;
};

type erEntityType = erNodeType<"entity", EntityNode>;
type erEntityAttributeType = erNodeType<
  "entity-attribute",
  EntityAttributeNode
>;
type erCompositeAttributeType = erNodeType<
  "composite-attribute",
  CompositeAttributeNode
>;
type erRelationshipType = erNodeType<"relationship", RelationshipNode>;
type erRelationshipAttributeType = erNodeType<
  "relationship-attribute",
  RelationshipAttributeNode
>;
type erAggregationType = erNodeType<"aggregation", AggregationNode>;
type erIsAType = erNodeType<"isA", IsANode>;

type ErNodeTypes = erEntityType &
  erEntityAttributeType &
  erCompositeAttributeType &
  erRelationshipType &
  erRelationshipAttributeType &
  erAggregationType &
  erIsAType;

type AddKeys<T, NewKeys extends keyof T> = T & { [key in NewKeys]: T[keyof T] };
type ErEdgeTypes = AddKeys<EdgeTypes, "erEdge">;

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
