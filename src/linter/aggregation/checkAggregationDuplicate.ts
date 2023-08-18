import { ER } from "../../types/parser/ER";
import { AggregationDuplicateError } from "../../types/linter/SemanticError";

/**
 * Finds duplicate aggregations by name in an ER object
 * @param {ER} er - The ER object to lint
 * @return {AggregationDuplicateError[]} An array of errors for each duplicate aggregation
 */
export const checkAggregationDuplicate = (
  er: ER,
): AggregationDuplicateError[] => {
  const errors: AggregationDuplicateError[] = [];

  const aggregationNames = new Map<string, number>();
  er.aggregations.forEach((agg) => {
    if (aggregationNames.has(agg.name)) {
      aggregationNames.set(agg.name, aggregationNames.get(agg.name)! + 1);
    } else {
      aggregationNames.set(agg.name, 1);
    }
  });

  for (const [aggName, freq] of aggregationNames) {
    if (freq > 1) {
      const lastLocation = er.aggregations
        .filter((agg) => agg.name === aggName)
        .pop()!.location;
      errors.push({
        type: "AGGREGATION_DUPLICATE",
        aggregationName: aggName,
        location: lastLocation,
      });
    }
  }
  return errors;
};
