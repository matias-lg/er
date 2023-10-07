import { Fragment, memo } from "react";
import { Handle, Position } from "reactflow";
import { CSSProperties } from "react";

const nodeHandleTypes = ["source", "target"] as const;
const fivePerSideIndexes = [1, 2, 3, 4] as const;

const baseStyle = {
  position: "absolute",
  opacity: 0,
} as const;

type DefaultHandleProps = {
  TopHandleStyle?: CSSProperties[];
  RightHandleStyle?: CSSProperties[];
  BottomHandleStyle?: CSSProperties[];
  LeftHandleStyle?: CSSProperties[];
  use5PerSide?: boolean;
};

export const NodeHandles = ({
  TopHandleStyle = [{}],
  RightHandleStyle = [{}],
  BottomHandleStyle = [{}],
  LeftHandleStyle = [{}],
  use5PerSide = false,
}: DefaultHandleProps) =>
  // prettier-ignore
  <>
  {nodeHandleTypes.map((type) => (
  // only relationships and entities care about ids other than t,r,b,l. Since they can have multiple edges between them.
  <Fragment key={type}>
    {/* TOP */}
    <Handle type={type} style={{...baseStyle, ...TopHandleStyle[0]}} position={Position.Top} id="t" />
    {use5PerSide &&
    <>
    {fivePerSideIndexes.map((i) => (
      <Handle key={i} type={type} style={{...baseStyle, ...TopHandleStyle[i]}} position={Position.Top} id={`${i}t`} />
    ))}
    </>}

    {/* RIGHT  */}
    <Handle type={type} style={{...baseStyle, ...RightHandleStyle[0] }} position={Position.Right} id="r" />
   {use5PerSide &&
    <>
    {fivePerSideIndexes.map((i) => (
      <Handle key={i} type={type} style={{...baseStyle, ...RightHandleStyle[i]}} position={Position.Right} id={`${i}r`} />
    ))}
    </>}
    
    {/* BOTTOM */}
    <Handle type={type} style={{...baseStyle, ...BottomHandleStyle[0] }} position={Position.Bottom} id="b" />
    {use5PerSide &&
    <>
    {fivePerSideIndexes.map((i) => (
      <Handle key={i} type={type} style={{...baseStyle, ...BottomHandleStyle[i]}} position={Position.Bottom} id={`${i}b`} />
    ))}
    </>}
    
    {/* LEFT */}
    <Handle type={type} style={{...baseStyle, ...LeftHandleStyle[0] }} position={Position.Left} id="l" />
    {use5PerSide &&
     <>
    {fivePerSideIndexes.map((i) => (
      <Handle key={i} type={type} style={{...baseStyle, ...LeftHandleStyle[i]}} position={Position.Left} id={`${i}l`} />
    ))}
    </>}
    
    </Fragment>
  ))}
  </>;

export default memo(NodeHandles);
