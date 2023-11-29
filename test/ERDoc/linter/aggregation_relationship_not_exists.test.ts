import { checkAggregationRelationshipNotExists } from "../../../src/ERDoc/linter/aggregation/checkAggregationRelationshipNotExists";
import { parse } from "../../../src/ERDoc/parser";
import { ER } from "../../../src/ERDoc/types/parser/ER";

describe("Linter detects aggregation that use a non existent relationship", () => {
  it("Detects a non existent relationship", () => {
    const errors = checkAggregationRelationshipNotExists(wrongER);
    expect(errors.length).toBe(1);
    expect(errors[0].aggregationName).toBe("RelatesToEntity");
    expect(errors[0].relationshipName).toBe("Relates");
    expect(errors[0].location).toEqual({
      start: {
        offset: 0,
        line: 1,
        column: 1,
      },
      end: {
        offset: 36,
        line: 1,
        column: 37,
      },
    });
  });

  it("Detects no errors when the relationship exists", () => {
    const errors = checkAggregationRelationshipNotExists(correctER);
    expect(errors.length).toBe(0);
  });

  it("Detects no errors when there are no aggregations", () => {
    const errors = checkAggregationRelationshipNotExists({
      entities: [],
      relationships: [],
      aggregations: [],
    });
    expect(errors.length).toBe(0);
  });
});

const wrongER: ER = parse(`aggregation RelatesToEntity(Relates)`);

const correctER: ER = parse(`relation Relates(SomeEntity: [weak, normal])
aggregation RelatesToEntity(Relates)`);
