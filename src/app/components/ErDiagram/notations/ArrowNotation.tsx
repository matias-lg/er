import { EdgeProps, MarkerType } from "reactflow";
import DefaultRelationship from "./DefaultRelationship";
import DefaultAttribute from "./DefaultAttribute";
import DefaultEntity from "./DefaultEntity";
import ArrowNotationEdge from "./ArrowNotationEdge";
import DefaultAggregation from "./DefaultAggregation";
import { ErNotation } from "../../../types/ErNotation";

const ArrowNotation: ErNotation = {
  nodeTypes: {
    entity: ({ data }: { data: { label: string; isWeak: boolean } }) => (
      <DefaultEntity data={data} />
    ),

    "entity-attribute": ({
      data,
    }: {
      data: { label: string; isKey: boolean; entityIsWeak: boolean };
    }) => <DefaultAttribute data={data} />,

    "composite-attribute": ({
      data,
    }: {
      data: { label: string; isKey: boolean; entityIsWeak: boolean };
    }) => <DefaultAttribute data={data} />,

    relationship: ({
      data,
    }: {
      data: { label: string; hasDependant: boolean };
    }) => <DefaultRelationship data={data} />,

    "relationship-attribute": ({
      data,
    }: {
      data: { label: string; isKey: boolean; entityIsWeak: boolean };
    }) => <DefaultAttribute data={{ ...data, isKey: false }} />,

    aggregation: ({
      data,
    }: {
      data: { label: string; width: number; height: number };
    }) => <DefaultAggregation data={data} />,
  },
  edgeTypes: {
    erEdge: (
      props: EdgeProps<{ cardinality: string; isTotalParticipation: string }>,
    ) => <ArrowNotationEdge {...props} />,
  },

  edgeMarkers: (cardinality, isTotalParticipation) => ({
    markerEnd: isTotalParticipation
      ? {
          type: MarkerType.ArrowClosed,
          width: 40,
          height: 40,
          color: "black",
        }
      : undefined,
  }),
};

export default ArrowNotation;
