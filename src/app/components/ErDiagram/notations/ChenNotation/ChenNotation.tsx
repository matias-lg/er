import { EdgeProps } from "reactflow";
import ChenEdge from "./ChenEdge";
import ErNotation from "../DefaultNotation";

class ChenNotation extends ErNotation {
  type = "chen";

  edgeTypes = {
    erEdge: (
      props: EdgeProps<{
        cardinality: string;
        isTotalParticipation: boolean;
        isInAggregation: boolean;
      }>,
    ) => (
      <ChenEdge
        {...{
          ...props,
          data: { ...props.data!, isOrthogonal: this.isOrthogonal! },
        }}
      />
    ),
  };

  edgeMarkers = (_cardinality: string, _isTotalParticipation: boolean) => ({});
  constructor(isOrthogonal: boolean) {
    super(isOrthogonal);
  }
}

export default ChenNotation;
