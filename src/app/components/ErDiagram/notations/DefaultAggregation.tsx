import { memo } from "react";
import { Handle, Position } from "reactflow";
import DefaultHandle from "./DefaultHandle";

const DefaultAggregation = ({ data }: { data: { label: string } }) => {
  return (
    <>
      <div className="z-10 flex h-[500px] w-[500px] border-2 border-black bg-transparent p-2">
        <div>{data.label}</div>
      </div>
      <DefaultHandle />
    </>
  );
};

export default memo(DefaultAggregation);
