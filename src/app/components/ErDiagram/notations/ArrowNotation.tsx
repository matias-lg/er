import { NodeTypes } from "reactflow";
import DefaultHandle from "./DefaultHandle";
import { DefaultRelationship } from "./DefaultRelationship";
import { DefaultAttribute } from "./DefaultAttribute";
import { DefaultEntity } from "./DefaultEntity";

const tmp = ({ data }: { data: { label: string } }) => (
  <>
    <div className="border-2 border-black p-2">
      <strong>{data.label}</strong>
    </div>
    <DefaultHandle />
  </>
);

const ArrowNotation: NodeTypes = {
  entity: ({
    data,
    selected,
  }: {
    data: { label: string; isWeak: boolean };
  }) => <DefaultEntity data={data} selected={selected} />,

  "entity-attribute": ({
    data,
  }: {
    data: { label: string; isKey: boolean; entityIsWeak: boolean };
  }) => <DefaultAttribute data={data} />,

  relationship: ({
    data,
  }: {
    data: { label: string; hasDependant: boolean };
  }) => <DefaultRelationship data={data} />,

  "relationship-attribute": ({
    data,
  }: {
    data: { label: string; isKey: boolean; entityIsWeak: boolean };
  }) => <DefaultAttribute data={{ ...data, isKey: false }} />,

  aggregation: tmp,
};

export default ArrowNotation;
