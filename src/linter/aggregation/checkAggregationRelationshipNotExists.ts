import { ER } from "../../types/parser/ER";
import { AggregationRelationshipNotExistsError } from "../../types/linter/SemanticError";

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
