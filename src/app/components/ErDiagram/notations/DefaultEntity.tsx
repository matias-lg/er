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
      <NodeHandles
        TopHandleStyle={[
          { top: "1%" },
          { top: "1%", left: "2%" },
          { top: "1%", left: "25%" },
          { top: "1%", left: "75%" },
          { top: "1%", left: "98%" },
        ]}
        BottomHandleStyle={[
          { bottom: "1%" },
          { bottom: "1%", left: "2%" },
          { bottom: "1%", left: "25%" },
          { bottom: "1%", left: "75%" },
          { bottom: "1%", left: "98%" },
        ]}
        LeftHandleStyle={[
          { left: "0" },
          { left: "0", top: "2%" },
          { left: "0", top: "25%" },
          { left: "0", top: "75%" },
          { left: "0", top: "98%" },
        ]}
        RightHandleStyle={[
          { right: "0" },
          { right: "0", top: "2%" },
          { right: "0", top: "25%" },
          { right: "0", top: "75%" },
          { right: "0", top: "98%" },
        ]}
        use5PerSide={true}
      />
    </>
  );
};

export default memo(DefaultEntity);
