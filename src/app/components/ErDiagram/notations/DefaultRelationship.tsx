import { memo } from "react";
import NodeHandles from "./NodeHandles";

type DefaultRelationshipProps = {
  data: { label: string; hasDependant: boolean };
};

const DefaultRelationship = ({ data }: DefaultRelationshipProps) => {
  {
    return (
      <>
        <div
          data-testid="relationship"
          className={`flex h-[95px] w-[95px] rotate-45 flex-col items-center justify-center
       rounded-sm ${
         data.hasDependant ? "border-[5px] border-double" : "border-2"
       } border-orange-700 bg-orange-200`}
        >
          <div className="-rotate-45">{data.label}</div>
        </div>
        <NodeHandles
          use5PerSide={true}
          TopHandleStyle={[
            { left: "50%", top: "-21.5%" },
            { left: "-21%", top: "46%" },
            { left: "25%", top: "2%" },
            { left: "75%", top: "2%" },
            { left: "121%", top: "46%" },
          ]}
          RightHandleStyle={[
            { top: "50%", right: "-21%" },
            { top: "-21%", right: "46%" },
            { top: "25%", right: "2%" },
            { top: "75%", right: "2%" },
            { top: "121%", right: "46%" },
          ]}
          LeftHandleStyle={[
            { top: "50%", left: "-21.5%" },
            { top: "-21%", left: "46%" },
            { top: "25%", left: "2%" },
            { top: "75%", left: "2%" },
            { top: "121%", left: "46%" },
          ]}
          BottomHandleStyle={[
            { left: "50%", bottom: "-21.5%" },
            { left: "-21%", bottom: "46%" },
            { left: "25%", bottom: "2%" },
            { left: "75%", bottom: "2%" },
            { left: "121%", bottom: "46%" },
          ]}
        />
      </>
    );
  }
};

export default memo(DefaultRelationship);
