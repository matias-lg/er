import { EdgeProps } from "reactflow";
import { ErNotation } from "../../../types/ErDiagram";
import ArrowNotationEdge from "./ArrowNotationEdge";
import DefaultNotation from "./DefaultNotation";

class ArrowNotation extends DefaultNotation {
  edgeTypes: ErNotation["edgeTypes"];
  edgeMarkers: ErNotation["edgeMarkers"];

  constructor() {
    super();

    this.edgeTypes = {
      erEdge: (
        props: EdgeProps<{
          cardinality: string;
          isTotalParticipation: boolean;
        }>,
      ) => <ArrowNotationEdge {...props} />,
    };

    this.edgeMarkers = (cardinality, _) => ({
      markerEnd: cardinality === "1" ? "black-arrow" : undefined,
    });
  }
}

export default ArrowNotation;
