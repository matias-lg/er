import { memo } from "react";
import { DefaultHandle } from "./DefaultHandle";
import { NodeResizer } from "reactflow";

const DefaultEntity = ({
  data,
  selected,
}: {
  selected: boolean;
  data: { label: string; isWeak: boolean };
}) => {
  return (
    <>
      <NodeResizer isVisible={selected} />
      <div
        className={`flex items-center justify-center ${
          data.isWeak ? "border-4 border-double" : "border-2"
        } z-10 min-w-[90px] border-black bg-white p-2`}
      >
        {data.label}
      </div>
      <DefaultHandle />
    </>
  );
};

export default memo(DefaultEntity);
