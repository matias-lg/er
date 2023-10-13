import { IErNotation } from "../../../types/ErDiagram";
import DefaultAggregation from "./DefaultAggregation";
import DefaultAttribute from "./DefaultAttribute";
import DefaultEntity from "./DefaultEntity";
import DefaultRelationship from "./DefaultRelationship";
import DefaultIsA from "./DefaultIsA";

abstract class ErNotation implements IErNotation {
  isOrthogonal: boolean;

  constructor(isOrthogonal: boolean = false) {
    this.isOrthogonal = isOrthogonal;
  }

  nodeTypes: IErNotation["nodeTypes"] = {
    entity: ({ data }) => <DefaultEntity data={data} />,

    "entity-attribute": ({ data }) => <DefaultAttribute data={data} />,

    "composite-attribute": ({ data }) => (
      <DefaultAttribute
        data={{
          label: data.label,
          isKey: false,
          entityIsWeak: false,
        }}
      />
    ),

    relationship: ({ data }) => <DefaultRelationship data={data} />,

    "relationship-attribute": ({ data }) => (
      <DefaultAttribute
        data={{ label: data.label, isKey: false, entityIsWeak: false }}
      />
    ),

    aggregation: ({ data }) => <DefaultAggregation data={data} />,

    isA: (_) => <DefaultIsA />,
  };

  abstract readonly edgeTypes: IErNotation["edgeTypes"];
  abstract readonly edgeMarkers: IErNotation["edgeMarkers"];
  abstract readonly type: string;
}

export default ErNotation;
