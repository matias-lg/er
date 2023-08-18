import { ER } from "../../types/parser/ER";
import { AggregationRelationshipNotExistsError } from "../../types/linter/SemanticError";

/**
 * Finds aggregations that reference relationships that don't exist in an ER object
 * @param {ER} er - The ER object to lint
 * @return {AggregationRelationshipNotExistsError[]} An array of errors for each aggregation that uses an invalid relationship
 */
export const checkAggregationRelationshipNotExists = (
  er: ER,
): AggregationRelationshipNotExistsError[] => {
  const errors: AggregationRelationshipNotExistsError[] = [];
  for (const agg of er.aggregations) {
    const relationshipName = agg.aggregatedRelationshipName;
    const relationshipExists = er.relationships.some(
      (rel) => rel.name === relationshipName,
    );
    if (!relationshipExists) {
      errors.push({
        type: "AGGREGATION_RELATIONSHIP_NOT_EXISTS",
        aggregationName: agg.name,
        relationshipName: relationshipName,
        location: agg.location,
      });
    }
  }
  return errors;
};
