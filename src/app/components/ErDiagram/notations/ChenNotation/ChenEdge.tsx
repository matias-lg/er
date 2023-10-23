import { BaseEdge, EdgeLabelRenderer, EdgeProps } from "reactflow";
import { useEdgePath } from "../useEdgePath";
import { getHandlePrefix } from "../../../../util/common";

function ChenEdge({
  id,
  label,
  source,
  target,
  data,
}: EdgeProps<{
  isOrthogonal: boolean;
  cardinality: string;
  isTotalParticipation: boolean;
  isInAggregation: boolean;
}>) {
  const [edgePath, labelX, labelY, roleLabelX, roleLabelY] = useEdgePath(
    source,
    target,
    data?.isOrthogonal!,
    0,
    getHandlePrefix(id),
  );
  if (edgePath === null) return null;

  return (
    <>
      <BaseEdge
        path={edgePath}
        id={id}
        label={data?.cardinality === undefined ? undefined : data.cardinality}
        labelX={labelX}
        labelY={labelY}
        labelBgStyle={{
          fill: data?.isInAggregation === true ? "#F8F5FC" : "#F8FAFC",
        }}
        labelStyle={{
          fontSize: "0.675rem",
        }}
        style={{
          strokeWidth: 1,
          stroke: "black",
        }}
        markerEnd={
          data?.isTotalParticipation === undefined
            ? undefined
            : data?.isTotalParticipation
            ? "url(#chen-full-circle)"
            : "url(#chen-empty-circle)"
        }
      />

      {/* roles */}
      {label !== undefined && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${roleLabelX}px,${roleLabelY}px)`,
              background: "#F8FAFC",
              padding: 3,
              borderRadius: 5,
              fontSize: 11,
              fontWeight: 500,
            }}
            className="nodrag nopan"
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

export default ChenEdge;
