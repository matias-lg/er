import { Handle, Position } from "reactflow";

export const DefaultHandle = () =>
  // prettier-ignore
  <>
    <Handle type="source"  position={Position.Top} id="t" />
    <Handle type="source"  position={Position.Right} id="r" />
    <Handle type="source"  position={Position.Bottom} id="b" />
    <Handle type="source"  position={Position.Left} id="l" />

    <Handle type="target"  position={Position.Top} id="t" />
    <Handle type="target"  position={Position.Right} id="r" />
    <Handle type="target"  position={Position.Bottom} id="b" />
    <Handle type="target"  position={Position.Left} id="l" />
  </>;

export default DefaultHandle;
