import { DefaultHandle } from "./DefaultHandle";
import { NodeResizer } from "reactflow";

export const DefaultEntity = ({
  data,
  selected,
}: {
  data: { label: string; isWeak: boolean };
}) => {
  console.log("selected:", selected);
  return (
    <>
      <NodeResizer isVisible={selected} maxWidth={200} maxHeight={500} />
      <div
        className={`flex h-max min-w-[70px]  border-[1px] border-black bg-white p-2`}
      >
        <div
          className={`${
            data.isWeak ? "z-10 border-[1px] border-black p-1" : ""
          } m-auto h-full w-full text-center`}
        >
          {data.label}
        </div>
      </div>
      <DefaultHandle />
    </>
  );
};
