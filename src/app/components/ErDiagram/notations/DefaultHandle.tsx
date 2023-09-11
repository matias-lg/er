import { Handle, Position } from "reactflow";

export const DefaultHandle = () =>
  // prettier-ignore
  <>
    <Handle type="source" className="opacity-0"  position={Position.Top} id="t" />
    <Handle type="source" className="opacity-0"  position={Position.Right} id="r" />
    <Handle type="source" className="opacity-0"  position={Position.Bottom} id="b" />
    <Handle type="source" className="opacity-0"  position={Position.Left} id="l" />

    <Handle type="target" className="opacity-0"  position={Position.Top} id="t" />
    <Handle type="target" className="opacity-0"  position={Position.Right} id="r" />
    <Handle type="target" className="opacity-0"  position={Position.Bottom} id="b" />
    <Handle type="target" className="opacity-0"  position={Position.Left} id="l" />
  </>;

export default DefaultHandle;
