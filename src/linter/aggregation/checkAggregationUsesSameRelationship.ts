import { ER } from "../../types/parser/ER";
import { AggregationUsesSameRelationshipError } from "../../types/linter/SemanticError";

/**
 * Finds aggregations that reference the same relationship
 * @param {ER} er - The ER object to lint
 * @return {AggregationUsesSameRelationshipError[]} An array of errors for each aggregation that references an already used relationship
 */
export const checkAggregationUsesSameRelationship = (
  er: ER,
): AggregationUsesSameRelationshipError[] => {
  const errors: AggregationUsesSameRelationshipError[] = [];
  const usedRelationships = new Set<string>();
  for (const agg of er.aggregations) {
    if (usedRelationships.has(agg.aggregatedRelationshipName))
      errors.push({
        type: "AGGREGATION_RELATIONSHIP_ALREADY_USED",
        aggregationName: agg.name,
        relationshipName: agg.aggregatedRelationshipName,
        location: agg.location,
      });
    else usedRelationships.add(agg.aggregatedRelationshipName);
  }

  return errors;
};
