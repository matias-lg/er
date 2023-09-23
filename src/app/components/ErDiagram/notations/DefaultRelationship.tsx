import { Fragment, memo } from "react";
import { Handle, Position } from "reactflow";

type DefaultRelationshipProps = {
  data: { label: string; hasDependant: boolean };
};

const handleTypes = ["source", "target"] as const;

const RelationshipHandles = ({ data }: DefaultRelationshipProps) =>
  // prettier-ignore
  <>
        {handleTypes.map((type) => (
        <Fragment key={type}>
            <Handle type={type} style={{ opacity: 0, transform: data.hasDependant ? "translate(-47px)" : "translate(-49px)",}} position={Position.Top} id="t"/>
            <Handle type={type} style={{ opacity: 0, transform: data.hasDependant ? "translate(2px,-49px)" : "translate(0,-49px)",}} position={Position.Right} id="r" />
            <Handle type={type} style={{ opacity: 0, transform: data.hasDependant ? "translate(-2px,42px)" : "translate(0px,42px)",}} position={Position.Left} id="l" />
            <Handle type={type} style={{ opacity: 0, transform: data.hasDependant ? "translate(42px, 2px)" : "translate(43px)",}}     position={Position.Bottom} id="b"/>
        </Fragment>
        ))}
        </>;

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
        <RelationshipHandles data={data} />
      </div>
    );
  }
};

export default memo(DefaultRelationship);
