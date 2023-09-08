import { memo } from "react";
import { DefaultHandle } from "./DefaultHandle";

type DefaultRelationshipProps = {
  data: { label: string; hasDependant: boolean };
};

const DefaultRelationship = ({ data }: DefaultRelationshipProps) => {
  {
    return (
      <>
        <div
          className={`mb-[10px] flex h-[95px] w-[95px] rotate-45 flex-col items-center justify-center
       rounded-sm ${
         data.hasDependant ? "border-4 border-double" : "border-[1px]"
       } border-black bg-white`}
        >
          <div className="-rotate-45">{data.label}</div>
        </div>
        <DefaultHandle />
      </>
    );
  }
};

export default memo(DefaultRelationship);
