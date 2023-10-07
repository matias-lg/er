import { BaseEdge, EdgeProps } from "reactflow";
import { useEdgePath } from "../useEdgePath";
import { getHandlePrefix } from "../../../../util/common";

function MinMaxEdge({
  id,
  label,
  source,
  target,
  data,
}: EdgeProps<{
  cardinality: string;
  isTotalParticipation: boolean;
  isInAggregation: boolean;
}>) {
  const [edgePath, labelX, labelY] = useEdgePath(
    source,
    target,
    0,
    getHandlePrefix(id),
  );
  if (edgePath === null) return null;

  return (
    <BaseEdge
      path={edgePath}
      id={id}
      label={
        data?.cardinality === undefined
          ? undefined
          : `${label === undefined ? "" : label?.toString() + ": "}(${
              data?.isTotalParticipation ? "1" : "0"
            }, ${data?.cardinality})`
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
