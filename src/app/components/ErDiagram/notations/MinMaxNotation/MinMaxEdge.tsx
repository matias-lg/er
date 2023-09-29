import { BaseEdge, EdgeProps } from "reactflow";
import { useEdgePath } from "../useEdgePath";

function MinMaxEdge({
  id,
  source,
  target,
  data,
}: EdgeProps<{ cardinality: string; isTotalParticipation: boolean }>) {
  const [edgePath, labelX, labelY] = useEdgePath(source, target);
  if (edgePath === null) return null;

  return (
    <BaseEdge
      path={edgePath}
      id={id}
      label={`(${
        data?.isTotalParticipation ? "1" : "0"
      }, ${data?.cardinality})`}
      labelX={data?.cardinality === undefined ? undefined : labelX}
      labelY={data?.cardinality === undefined ? undefined : labelY}
      style={{
        strokeWidth: 1,
        stroke: "black",
      }}
    />
  );
}

export default MinMaxEdge;
