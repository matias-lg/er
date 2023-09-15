import { Fragment, memo } from "react";
import { Handle, Position } from "reactflow";

const handleTypes = ["source", "target"] as const;

export const DefaultHandle = () =>
  // prettier-ignore
  <>
  {handleTypes.map((type) => (
  <Fragment key={type}>
    <Handle type={type} className="opacity-0"  position={Position.Top} id="t" />
    <Handle type={type} className="opacity-0"  position={Position.Right} id="r" />
    <Handle type={type} className="opacity-0"  position={Position.Bottom} id="b" />
    <Handle type={type} className="opacity-0"  position={Position.Left} id="l" />
    </Fragment>
  ))}
  </>;

export default memo(DefaultHandle);
