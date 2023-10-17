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
    entity: (nodeProps) => <DefaultEntity {...nodeProps} />,

    "entity-attribute": (nodeProps) => <DefaultAttribute {...nodeProps} />,

    "composite-attribute": (nodeProps) => (
      <DefaultAttribute
        {...nodeProps}
        data={{
          label: nodeProps.data.label,
          isKey: false,
          entityIsWeak: false,
        }}
      />
    ),

    relationship: (nodeProps) => <DefaultRelationship {...nodeProps} />,

    "relationship-attribute": (nodeProps) => (
      <DefaultAttribute
        {...nodeProps}
        data={{
          label: nodeProps.data.label,
          isKey: false,
          entityIsWeak: false,
        }}
      />
    ),

    aggregation: (nodeProps) => <DefaultAggregation {...nodeProps} />,

    isA: (_) => <DefaultIsA />,
  };

  abstract readonly edgeTypes: IErNotation["edgeTypes"];
  abstract readonly edgeMarkers: IErNotation["edgeMarkers"];
  abstract readonly type: string;
}

export default ErNotation;
