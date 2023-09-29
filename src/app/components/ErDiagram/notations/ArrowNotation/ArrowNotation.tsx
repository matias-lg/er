import { EdgeProps } from "reactflow";
import ErNotation from "../DefaultNotation";
import ArrowNotationEdge from "./ArrowNotationEdge";

class ArrowNotation extends ErNotation {
  type = "arrow";
  edgeTypes = {
    erEdge: (
      props: EdgeProps<{
        cardinality: string;
        isTotalParticipation: boolean;
      }>,
    ) => <ArrowNotationEdge {...props} />,
  };

  edgeMarkers = (cardinality: string, _isTotalParticipation: boolean) => ({
    markerEnd: cardinality === "1" ? "black-arrow" : undefined,
  });

  constructor() {
    super();
  }
}

export default ArrowNotation;
