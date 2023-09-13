import { useCallback } from "react";
import { useStore, getStraightPath, EdgeProps, BaseEdge } from "reactflow";
import { getSimpleEdgeParams } from "../../../util/getSimpleEdgeParams";

function ArrowNotationEdge({
  id,
  source,
  target,
  data,
  markerStart,
  markerEnd,
}: EdgeProps<{ cardinality: string; isTotalParticipation: string }>) {
  const sourceNode = useStore(
    useCallback((store) => store.nodeInternals.get(source), [source]),
  );
  const targetNode = useStore(
    useCallback((store) => store.nodeInternals.get(target), [target]),
  );

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty } = getSimpleEdgeParams(sourceNode, targetNode);

  const [edgePath] = getStraightPath({
    sourceX: sx,
    sourceY: sy,
    targetX: tx,
    targetY: ty,
  });

  return (
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
