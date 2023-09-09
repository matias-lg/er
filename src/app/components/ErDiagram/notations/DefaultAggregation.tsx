import { memo } from "react";
import { Handle, Position } from "reactflow";

const DefaultAggregation = ({ data }: { data: { label: string } }) => {
  return (
    <>
      <div className="z-10 flex h-[500px] w-[500px] border-2 border-black bg-transparent p-2">
        <div>{data.label}</div>
      </div>
      <Handle position={Position.Top} type="source" />
      <Handle position={Position.Top} type="target" />
    </>
  );
};

export default memo(DefaultAggregation);
