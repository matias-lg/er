import { BaseEdge, EdgeProps } from "reactflow";
import { useEdgePath } from "../useEdgePath";

function MinMaxEdge({
  id,
  source,
  target,
  data,
}: EdgeProps<{
  cardinality: string;
  isTotalParticipation: boolean;
  isInAggregation: boolean;
}>) {
  const [edgePath, labelX, labelY] = useEdgePath(source, target);
  if (edgePath === null) return null;

  return (
    <BaseEdge
      path={edgePath}
      id={id}
      label={
        data?.cardinality === undefined
          ? undefined
          : `(${data?.isTotalParticipation ? "1" : "0"}, ${data?.cardinality})`
      }
      labelX={labelX}
      labelY={labelY}
      labelBgStyle={{
        fill: data?.isInAggregation === true ? "#F8F5FC" : "#F8FAFC",
      }}
      labelStyle={{
        fontSize: "0.875rem",
      }}
      style={{
        strokeWidth: 1,
        stroke: "black",
      }}
    />
  );
}

export default MinMaxEdge;
