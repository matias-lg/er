import { Handle, Position } from "reactflow";

export const DefaultHandle = () => (
  <>
    <Handle type="source" position={Position.Right} />
    <Handle type="target" position={Position.Left} />
    {/* <Handle
      position={Position.Top}
      type="source"
      style={{
        position: "absolute",
        top: "50%",
        right: "50%",
        transform: "translate(50%,-50%)",
      }}
    />
    <Handle
      position={Position.Top}
      type="target"
      style={{
        position: "absolute",
        top: "50%",
        right: "50%",
        transform: "translate(50%,-50%)",
      }}
    /> */}
  </>
);

export default DefaultHandle;
