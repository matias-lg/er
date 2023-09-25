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

  // we mix const and let assigments, eslint will complain in both cases
  // eslint-disable-next-line prefer-const
  let { sx, sy, tx, ty } = getErEdgeParams(sourceNode, targetNode);
  if (data?.isTotalParticipation && data.cardinality === "1") {
    // we need to shorten the path so the arrowhead looks good
    const ARROW_LENGTH = 7;
    const angle = Math.atan2(ty - sy, tx - sx);
    const dist = Math.sqrt((tx - sx) ** 2 + (ty - sy) ** 2);
    tx = sx + (dist - ARROW_LENGTH) * Math.cos(angle);
    ty = sy + (dist - ARROW_LENGTH) * Math.sin(angle);
  }

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
