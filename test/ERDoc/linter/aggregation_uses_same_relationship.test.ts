import { ER } from "../../../src/ERDoc/types/parser/ER";
import { checkAggregationUsesSameRelationship } from "../../../src/ERDoc/linter/aggregation/checkAggregationUsesSameRelationship";
import { parse } from "../../../src/ERDoc/parser";

describe("Linter detects when two aggregations use the same relationship", () => {
  it("return an error when two aggregations use the same relationship", () => {
    const errors = checkAggregationUsesSameRelationship(wrongER);
    expect(errors.length).toBe(1);
    expect(errors[0].aggregationName).toBe("Parser_parses_string");
    expect(errors[0].relationshipName).toBe("Executes");
    expect(errors[0].location).toEqual({
      start: {
        offset: 43,
        line: 2,
        column: 1,
      },
      end: {
        offset: 85,
        line: 2,
        column: 43,
      },
    });
  });

  it("returns no errors when aggregations use a different relationship", () => {
    const errors = checkAggregationUsesSameRelationship(correctER);
    expect(errors.length).toBe(0);
  });

  it("returns no errors for a single aggregation", () => {
    const errors = checkAggregationUsesSameRelationship(singleAggER);
    expect(errors.length).toBe(0);
  });
});

const wrongER: ER = parse(`aggregation Linter_checks_errors(Executes)
aggregation Parser_parses_string(Executes)`);

const correctER: ER = parse(`aggregation Linter_checks_errors(Lints)
aggregation Parser_parses_string(Parses)`);

const singleAggER: ER = parse(`aggregation Linter_checks_errors(Executes)`);
