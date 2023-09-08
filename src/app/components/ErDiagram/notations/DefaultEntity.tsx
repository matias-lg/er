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
  console.log("selected:", selected);
  return (
    <>
      <NodeResizer isVisible={selected} />
      <div
        className={`flex ${
          data.isWeak ? "border-4 border-double" : "border-[1px]"
        } border-black bg-white p-2`}
      >
        <div>{data.label}</div>
      </div>
      <DefaultHandle />
    </>
  );
};

export default memo(DefaultEntity);
