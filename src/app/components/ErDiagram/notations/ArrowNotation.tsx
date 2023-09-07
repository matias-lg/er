import { NodeTypes } from "reactflow";
import DefaultHandle from "./DefaultHandle";

const tmp = ({ data }: { data: { label: string } }) => (
  <>
    <div className="border-2 border-black p-2">
      <strong>{data.label}</strong>
    </div>
    <DefaultHandle />
  </>
);

const ArrowNotation: NodeTypes = {
  entity: ({ data }: { data: { label: string; isWeak: boolean } }) => (
    <>
      <div className="w-max border-2 border-black bg-white p-1">
        <div className={data.isWeak ? "border-2 border-black p-2" : ""}>
          {data.label}
        </div>
      </div>
      <DefaultHandle />
    </>
  ),
  "entity-attribute": ({
    data,
  }: {
    data: { label: string; isKey: boolean; isPartial: boolean };
  }) => (
    <>
      <div className="border-2 border-black bg-white p-1">
        <p className={data.isKey ? "underline-offset-1	" : ""}> {data.label} </p>
      </div>
      <DefaultHandle />
    </>
  ),

  relationship: ({
    data,
  }: {
    data: { label: string; hasDependant: boolean };
  }) => (
    <>
      <div className="h-[56px] w-[56px]">
        <div className="absolute left-1/2 top-1/2 h-[80px] w-[80px] -translate-x-2/4 -translate-y-2/4 rotate-45 border-2 border-black bg-white">
          <div className="relative  flex h-full -rotate-45 items-center justify-center">
            {data.label}
          </div>
        </div>
      </div>
      <DefaultHandle />
    </>
  ),
  "relationship-attribute": tmp,

  aggregation: tmp,
};

export default ArrowNotation;
