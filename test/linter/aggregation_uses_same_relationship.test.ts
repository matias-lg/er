import { ER } from "../../src/types/parser/ER";
import { checkAggregationUsesSameRelationship } from "../../src/linter/aggregation/checkAggregationUsesSameRelationship";

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

/*
aggregation Linter_checks_errors(Executes)
aggregation Parser_parses_string(Executes)
*/
const wrongER: ER = {
  entities: [],
  relationships: [],
  aggregations: [
    {
      type: "aggregation",
      name: "Linter_checks_errors",
      aggregatedRelationshipName: "Executes",
      location: {
        start: {
          offset: 0,
          line: 1,
          column: 1,
        },
        end: {
          offset: 42,
          line: 1,
          column: 43,
        },
      },
    },
    {
      type: "aggregation",
      name: "Parser_parses_string",
      aggregatedRelationshipName: "Executes",
      location: {
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
      },
    },
  ],
};

/*
aggregation Linter_checks_errors(Lints)
aggregation Parser_parses_string(Parses)
*/
const correctER: ER = {
  entities: [],
  relationships: [],
  aggregations: [
    {
      type: "aggregation",
      name: "Linter_checks_errors",
      aggregatedRelationshipName: "Lints",
      location: {
        start: {
          offset: 0,
          line: 1,
          column: 1,
        },
        end: {
          offset: 39,
          line: 1,
          column: 40,
        },
      },
    },
    {
      type: "aggregation",
      name: "Parser_parses_string",
      aggregatedRelationshipName: "Parses",
      location: {
        start: {
          offset: 40,
          line: 2,
          column: 1,
        },
        end: {
          offset: 80,
          line: 2,
          column: 41,
        },
      },
    },
  ],
};

/*
aggregation Linter_checks_errors(Executes)
*/
const singleAggER: ER = {
  entities: [],
  relationships: [],
  aggregations: [
    {
      type: "aggregation",
      name: "Linter_checks_errors",
      aggregatedRelationshipName: "Executes",
      location: {
        start: {
          offset: 0,
          line: 1,
          column: 1,
        },
        end: {
          offset: 42,
          line: 1,
          column: 43,
        },
      },
    },
  ],
};
