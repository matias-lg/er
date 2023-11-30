import { CSSProperties, ComponentType } from "react";
import { EdgeMarkerType, EdgeTypes, NodeProps } from "reactflow";
import { Node, Edge } from "reactflow";

export type NodeConstraints = (
  | {
      type: "alignment";
      axis: "x" | "y";
      offsets: { node: string; offset: string }[];
    }
  | {
      type: "inequality";
      axis: "x" | "y";
      left: string;
      right: string;
      gap: number;
    }
)[];

export type EntityNode = Node<
  {
    label: string;
    isWeak: boolean;
    constraints?: NodeConstraints;
    erId?: string;
  },
  "entity"
>;

export type EntityAttributeNode = Node<
  {
    label: string;
    isKey: boolean;
    entityIsWeak: boolean;
    constraints?: NodeConstraints;
    erId?: string;
  },
  "entity-attribute"
>;

export type CompositeAttributeNode = Node<
  {
    label: string;
    constraints?: NodeConstraints;
    erId?: string;
  },
  "composite-attribute"
>;

export type RelationshipNode = Node<
  {
    label: string;
    hasDependant: boolean;
    constraints?: NodeConstraints;
    erId?: string;
  },
  "relationship"
>;

export type RelationshipAttributeNode = Node<
  {
    label: string;
    constraints?: NodeConstraints;
    erId?: string;
  },
  "relationship-attribute"
>;

export type AggregationNode = Node<
  {
    label: string;
    width?: number;
    height?: number;
    constraints?: NodeConstraints;
    erId?: string;
  },
  "aggregation"
>;

export type IsANode = Node<
  {
    constraints?: NodeConstraints;
    erId?: string;
  },
  "isA"
>;

export type EntityEdge = Edge<{
  cardinality: string;
  isTotalParticipation: boolean;
  constraints?: NodeConstraints;
  erId?: string;
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

export interface IErNotation {
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
}
