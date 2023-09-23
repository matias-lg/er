import { EdgeProps } from "reactflow";
import {
  AggregationNode,
  EntityAttributeNode,
  EntityNode,
  ErNotation,
  RelationshipAttributeNode,
  RelationshipNode,
} from "../../../types/ErDiagram";
import ArrowNotationEdge from "./ArrowNotationEdge";
import DefaultAggregation from "./DefaultAggregation";
import DefaultAttribute from "./DefaultAttribute";
import DefaultEntity from "./DefaultEntity";
import DefaultRelationship from "./DefaultRelationship";

const ArrowNotation: ErNotation = {
  nodeTypes: {
    entity: ({ data }: { data: EntityNode["data"] }) => (
      <DefaultEntity data={data} />
    ),

    "entity-attribute": ({ data }: { data: EntityAttributeNode["data"] }) => (
      <DefaultAttribute data={data} />
    ),

    "composite-attribute": ({
      data,
    }: {
      data: EntityAttributeNode["data"];
    }) => <DefaultAttribute data={data} />,

    relationship: ({ data }: { data: RelationshipNode["data"] }) => (
      <DefaultRelationship data={data} />
    ),

    "relationship-attribute": ({
      data,
    }: {
      data: RelationshipAttributeNode["data"];
    }) => (
      <DefaultAttribute data={{ ...data, isKey: false, entityIsWeak: false }} />
    ),

    aggregation: ({ data }: { data: AggregationNode["data"] }) => (
      <DefaultAggregation data={data} />
    ),
  },

  edgeTypes: {
    erEdge: (
      props: EdgeProps<{ cardinality: string; isTotalParticipation: boolean }>,
    ) => <ArrowNotationEdge {...props} />,
  },

  edgeMarkers: (cardinality) => ({
    markerEnd: cardinality === "1" ? "black-arrow" : undefined,
  }),
};

export default ArrowNotation;
