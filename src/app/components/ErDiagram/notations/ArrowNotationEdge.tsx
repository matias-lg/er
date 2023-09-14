import { useCallback } from "react";
import { useStore, getStraightPath, EdgeProps, BaseEdge } from "reactflow";
import { getErEdgeParams } from "../../../util/getErEdgeParams";

function ArrowNotationEdge({
  id,
  source,
  target,
  markerStart,
  data,
  markerEnd,
}: EdgeProps<{ cardinality: string; isTotalParticipation: boolean }>) {
  const sourceNode = useStore(
    useCallback((store) => store.nodeInternals.get(source), [source]),
  );
  const targetNode = useStore(
    useCallback((store) => store.nodeInternals.get(target), [target]),
  );

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty } = getErEdgeParams(sourceNode, targetNode);

  const [edgePath] = getStraightPath({
    sourceX: sx,
    sourceY: sy,
    targetX: tx,
    targetY: ty,
  });

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
          strokeWidth: 3.5,
        }}
      />

      <path
        id={id}
        key={2}
        className="react-flow__edge-path"
        markerHeight={19}
        markerEnd={data.cardinality === "1" ? "url(#1to1-arrow)" : undefined}
        d={edgePath}
        style={{
          fill: "none",
          stroke: "white",
          strokeWidth: 1.5,
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
