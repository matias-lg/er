import { memo } from "react";
import NodeHandles from "./NodeHandles";

type DefaultRelationshipProps = {
  data: { label: string; hasDependant: boolean };
};

const DefaultRelationship = ({ data }: DefaultRelationshipProps) => {
  {
    // prettier-ignore
    return (
      <div
        data-testid="relationship"
        className={`flex h-[95px] w-[95px] rotate-45 flex-col items-center justify-center
       rounded-sm ${
         data.hasDependant ? "border-[5px] border-double" : "border-2"
       } border-orange-700 bg-orange-200`}
      >
        <div className="-rotate-45">{data.label}</div>
        <NodeHandles
          use5PerSide={true}

          TopHandleStyle={[
            { opacity: 0, transform: data.hasDependant ? "translate(-48px, -2px)" : "translate(-48px, 2px)",},
            { opacity: 0, transform: data.hasDependant ? "translate(-48px, -2px)" : "translate(-48px, 2px)",},
            { opacity: 0, transform: data.hasDependant ? "translate(-48px, -2px)" : "translate(-48px, 2px)",},
            { opacity: 0, transform: data.hasDependant ? "translate(-48px, -2px)" : "translate(-48px, 2px)",},
            { opacity: 0, transform: data.hasDependant ? "translate(-48px, -2px)" : "translate(-48px, 2px)",},
          ]}

          RightHandleStyle={[
            { opacity: 0, top: "0%", },
            { opacity: 0, top: "0%", },
            { opacity: 0, top: "0%", },
            { opacity: 0, top: "0%", },
            { opacity: 0, top: "0%", },
          ]}

          LeftHandleStyle={[
            { opacity: 0, top: "98%", left: "-1%", },
            { opacity: 0, top: "98%", left: "-1%", },
            { opacity: 0, top: "98%", left: "-1%", },
            { opacity: 0, top: "98%", left: "-1%", },
            { opacity: 0, top: "98%", left: "-1%", },
          ]}
          BottomHandleStyle={[
            { transform: data.hasDependant ? "translate(42px, 2px)" : "translate(43px)", },
            { transform: data.hasDependant ? "translate(42px, 2px)" : "translate(43px)", },
            { transform: data.hasDependant ? "translate(42px, 2px)" : "translate(43px)", },
            { transform: data.hasDependant ? "translate(42px, 2px)" : "translate(43px)", },
            { transform: data.hasDependant ? "translate(42px, 2px)" : "translate(43px)", },
          ]}
        />
      </div>
    );
  }
};

export default memo(DefaultRelationship);
