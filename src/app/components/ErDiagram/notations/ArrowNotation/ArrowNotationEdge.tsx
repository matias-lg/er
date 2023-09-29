import { BaseEdge, EdgeProps } from "reactflow";
import { useEdgePath } from "../useEdgePath";

const ARROW_LENGTH = 7;

function ArrowNotationEdge({
  id,
  source,
  target,
  markerStart,
  data,
  markerEnd,
}: EdgeProps<{ cardinality: string; isTotalParticipation: boolean }>) {
  const [edgePath, ,] = useEdgePath(
    source,
    target,
    data?.isTotalParticipation && data.cardinality === "1" ? ARROW_LENGTH : 0,
  );
  if (edgePath === null) return null;

  return data?.isTotalParticipation ? (
    <>
      {/* double line */}
      <path
        id={id}
        key={1}
        className="react-flow__edge-path"
        d={edgePath}
        markerStart={markerStart}
        style={{
          fill: "none",
          stroke: "black",
          strokeWidth: 5,
        }}
      />

      <path
        id={id}
        key={2}
        className="react-flow__edge-path"
        markerEnd={data.cardinality === "1" ? "url(#1to1-arrow)" : undefined}
        d={edgePath}
        style={{
          fill: "none",
          stroke: "white",
          strokeWidth: 3,
        }}
      />
    </>
  ) : (
    <BaseEdge
      path={edgePath}
      id={id}
      markerEnd={markerEnd}
      markerStart={markerStart}
      style={{
        strokeWidth: 1,
        stroke: "black",
      }}
    />
  );
}

export default ArrowNotationEdge;
