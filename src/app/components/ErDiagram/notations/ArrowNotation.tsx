import { EdgeProps } from "reactflow";
import { ErNotation } from "../../../types/ErDiagram";
import ArrowNotationEdge from "./ArrowNotationEdge";
import DefaultAggregation from "./DefaultAggregation";
import DefaultAttribute from "./DefaultAttribute";
import DefaultEntity from "./DefaultEntity";
import DefaultRelationship from "./DefaultRelationship";

const ArrowNotation: ErNotation = {
  nodeTypes: {
    entity: ({ data }) => <DefaultEntity data={data} />,

    "entity-attribute": ({ data }) => <DefaultAttribute data={data} />,

    "composite-attribute": ({ data }) => (
      <DefaultAttribute
        data={{
          label: data.label,
          isKey: false,
          entityIsWeak: false,
        }}
      />
    ),

    relationship: ({ data }) => <DefaultRelationship data={data} />,

    "relationship-attribute": ({ data }) => (
      <DefaultAttribute
        data={{ label: data.label, isKey: false, entityIsWeak: false }}
      />
    ),

    aggregation: ({ data }) => <DefaultAggregation data={data} />,

    isA: (_) => <DefaultEntity data={{ label: "isA", isWeak: false }} />,
  },

  edgeTypes: {
    erEdge: (
      props: EdgeProps<{ cardinality: string; isTotalParticipation: boolean }>,
    ) => <ArrowNotationEdge {...props} />,
  },

  edgeMarkers: (cardinality, _) => ({
    markerEnd: cardinality === "1" ? "black-arrow" : undefined,
  }),
};

export default ArrowNotation;
