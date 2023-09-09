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
         data.hasDependant ? "border-[5px] border-double" : "border-2"
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
