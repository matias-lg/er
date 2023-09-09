import { NodeTypes } from "reactflow";
import DefaultRelationship from "./DefaultRelationship";
import DefaultAttribute from "./DefaultAttribute";
import DefaultEntity from "./DefaultEntity";
import DefaultAggregation from "./DefaultAggregation";

const ArrowNotation: NodeTypes = {
  entity: ({
    data,
    selected,
  }: {
    data: { label: string; isWeak: boolean };
    selected: boolean;
  }) => <DefaultEntity data={data} selected={selected} />,

  "entity-attribute": ({
    data,
  }: {
    data: { label: string; isKey: boolean; entityIsWeak: boolean };
  }) => <DefaultAttribute data={data} />,

  "composite-attribute": ({
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

  aggregation: ({ data }: { data: { label: string } }) => (
    <DefaultAggregation data={data} />
  ),
};

export default ArrowNotation;
