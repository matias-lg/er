import { Fragment, memo } from "react";
import { Handle, Position } from "reactflow";
import { CSSProperties } from "react";

const nodeHandleTypes = ["source", "target"] as const;

type DefaultHandleProps = {
  TopHandleStyle?: CSSProperties;
  RightHandleStyle?: CSSProperties;
  BottomHandleStyle?: CSSProperties;
  LeftHandleStyle?: CSSProperties;
};

export const NodeHandles = ({
  TopHandleStyle = {},
  RightHandleStyle = {},
  BottomHandleStyle = {},
  LeftHandleStyle = {},
}: DefaultHandleProps) =>
  // prettier-ignore
  <>
  {nodeHandleTypes.map((type) => (
  <Fragment key={type}>
    <Handle type={type} style={{position: "absolute", opacity: 0, ...TopHandleStyle}} position={Position.Top} id="t" />
    <Handle type={type} style={{position: "absolute", opacity: 0, ...RightHandleStyle }} position={Position.Right} id="r" />
    <Handle type={type} style={{position: "absolute", opacity: 0, ...BottomHandleStyle }} position={Position.Bottom} id="b" />
    <Handle type={type} style={{position: "absolute", opacity: 0, ...LeftHandleStyle }} position={Position.Left} id="l" />
    </Fragment>
  ))}
  </>;

export default memo(NodeHandles);
