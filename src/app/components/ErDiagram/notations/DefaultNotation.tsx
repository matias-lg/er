import { ErNotation } from "../../../types/ErDiagram";
import DefaultAggregation from "./DefaultAggregation";
import DefaultAttribute from "./DefaultAttribute";
import DefaultEntity from "./DefaultEntity";
import DefaultRelationship from "./DefaultRelationship";
import DefaultIsA from "./DefaultIsA";

abstract class DefaultNotation implements ErNotation {
  nodeTypes: ErNotation["nodeTypes"];
  abstract edgeTypes: ErNotation["edgeTypes"];
  abstract edgeMarkers: ErNotation["edgeMarkers"];

  constructor() {
    this.nodeTypes = {
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
  }
}

export default DefaultNotation;
