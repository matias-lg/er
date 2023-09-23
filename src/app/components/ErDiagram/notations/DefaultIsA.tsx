import { memo } from "react";
import NodeHandles from "./NodeHandles";

const DefaultIsA = () => {
  return (
    <>
      <svg className="block h-16 w-24 overflow-visible">
        <path
          d="M8,0 L88,0 L48,70 z"
          fill="#bbf7d0"
          stroke-width="2"
          stroke="#15803d"
        ></path>
      </svg>

      <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center">
        <div className="mb-2">IsA</div>
      </div>

      <NodeHandles
        RightHandleStyle={{ right: "25%" }}
        LeftHandleStyle={{ left: "25%" }}
        BottomHandleStyle={{ top: "106%" }}
      />
    </>
  );
};

export default memo(DefaultIsA);
