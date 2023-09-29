import { memo } from "react";
import NodeHandles from "./NodeHandles";

const DefaultLabel = ({ data }: { data: { label: string } }) => {
  return (
    <>
      <div className="flex min-w-[10px] items-center justify-center border-0 p-1">
        {data.label}
      </div>
      <NodeHandles
        TopHandleStyle={{ top: "1%" }}
        BottomHandleStyle={{ bottom: "1%" }}
        LeftHandleStyle={{ left: "0" }}
        RightHandleStyle={{ right: "0" }}
      />
    </>
  );
};

export default memo(DefaultLabel);
