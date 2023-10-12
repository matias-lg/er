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
    ) => ( 
      // inject isOrthogonal into edge data
      <ArrowNotationEdge
        {...{
          ...props,
          data: { ...props.data!, isOrthogonal: this.isOrthogonal! },
        }}
      />
     ),
  };

  edgeMarkers = (cardinality: string, _isTotalParticipation: boolean) => ({
    markerEnd: cardinality === "1" ? "black-arrow" : undefined,
  });

  constructor(isOrthogonal: boolean) {
    super(isOrthogonal);
  }
}

export default ArrowNotation;
