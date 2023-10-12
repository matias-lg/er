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
        isInAggregation: boolean;
      }>,
    ) => (
      <MinMaxEdge
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

export default MinMaxNotation;
