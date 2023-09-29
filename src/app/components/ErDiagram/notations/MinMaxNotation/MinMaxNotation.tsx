import { EdgeProps } from "reactflow";
import MinMaxEdge from "./MinMaxEdge";
import ErNotation from "../DefaultNotation";

class MinMaxNotation extends ErNotation {
  type = "minMax";

  edgeTypes = {
    erEdge: (
      props: EdgeProps<{
        cardinality: string;
        isTotalParticipation: boolean;
      }>,
    ) => <MinMaxEdge {...props} />,
  };

  edgeMarkers = (_cardinality: string, _isTotalParticipation: boolean) => ({});
  constructor() {
    super();
  }
}

export default MinMaxNotation;
