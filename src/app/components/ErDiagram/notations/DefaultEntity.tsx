import { memo } from "react";
import { DefaultHandle } from "./DefaultHandle";

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
        } z-10 min-w-[90px] border-black bg-white p-2`}
      >
        {data.label}
      </div>
      <DefaultHandle />
    </>
  );
};

export default memo(DefaultEntity);
