import { memo } from "react";
import NodeHandles from "./NodeHandles";

const DefaultEntity = ({
  data,
}: {
  data: { label: string; isWeak: boolean };
}) => {
  return (
    <>
      <div
        className={`flex items-center justify-center ${
          data.isWeak ? "border-[5px] border-double" : "border-2"
        } z-10 min-w-[90px] border-blue-700 bg-blue-200 p-2`}
      >
        {data.label}
      </div>
      <NodeHandles />
    </>
  );
};

export default memo(DefaultEntity);
