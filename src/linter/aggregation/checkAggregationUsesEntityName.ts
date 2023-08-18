import { ER } from "../../types/parser/ER";
import { AggregationUsesEntityName } from "../../types/linter/SemanticError";

/**
 * Finds duplicate aggregations by name in an ER object
 * @param {ER} er - The ER object to lint
 * @return {AggregationUsesEntityName[]} An array of errors for each duplicate aggregation
 */
export const checkAggregationUsesEntityName = (
  er: ER,
): AggregationUsesEntityName[] => {
  const errors: AggregationUsesEntityName[] = [];
  const entityNames = new Map<string, number>();
  // aggregations are virtual entities, so entity names must be already occupied
  er.entities.forEach((entity) => {
    if (entityNames.has(entity.name)) {
      entityNames.set(entity.name, entityNames.get(entity.name)! + 1);
    } else {
      entityNames.set(entity.name, 1);
    }
  });

  for (const agg of er.aggregations) {
    if (entityNames.has(agg.name)) {
      errors.push({
        type: "AGGREGATION_USES_ENTITY_NAME",
        aggregationName: agg.name,
        location: agg.location,
      });
    }
  }

  return errors;
};
