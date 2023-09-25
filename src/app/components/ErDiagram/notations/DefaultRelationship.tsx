import { memo } from "react";
import NodeHandles from "./NodeHandles";

type DefaultRelationshipProps = {
  data: { label: string; hasDependant: boolean };
};

const DefaultRelationship = ({ data }: DefaultRelationshipProps) => {
  {
    return (
      <div
        className={`mb-[10px] flex h-[95px] w-[95px] rotate-45 flex-col items-center justify-center
       rounded-sm ${
         data.hasDependant ? "border-[5px] border-double" : "border-2"
       } border-orange-700 bg-orange-200`}
      >
        <div className="-rotate-45">{data.label}</div>
        <NodeHandles
          TopHandleStyle={{
            opacity: 0,
            transform: data.hasDependant
              ? "translate(-48px, -2px)"
              : "translate(-48px, 2px)",
          }}
          RightHandleStyle={{
            transform: data.hasDependant
              ? "translate(2px,-49px)"
              : "translate(0,-49px)",
          }}
          LeftHandleStyle={{
            transform: data.hasDependant
              ? "translate(-2px,42px)"
              : "translate(0px,42px)",
          }}
          BottomHandleStyle={{
            transform: data.hasDependant
              ? "translate(42px, 2px)"
              : "translate(43px)",
          }}
        />
      </div>
    );
  }
};

export default memo(DefaultRelationship);
