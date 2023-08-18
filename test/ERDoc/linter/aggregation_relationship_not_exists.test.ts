import { checkAggregationRelationshipNotExists } from "../../../src/ERDoc/linter/aggregation/checkAggregationRelationshipNotExists";
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

/*aggregation RelatesToEntity(Relates)*/
const wrongER: ER = {
  entities: [],
  relationships: [],
  aggregations: [
    {
      type: "aggregation",
      name: "RelatesToEntity",
      aggregatedRelationshipName: "Relates",
      location: {
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
      },
    },
  ],
};

/*
relation Relates(Entity: [weak, normal])
aggregation RelatesToEntity(Relates)
*/
const correctER: ER = {
  entities: [],
  relationships: [
    {
      type: "relationship",
      name: "Relates",
      participantEntities: [
        {
          entityName: "Entity",
          isComposite: true,
          childParticipants: [
            {
              entityName: "weak",
              isComposite: false,
              cardinality: "N",
              participation: "partial",
              location: {
                start: {
                  offset: 26,
                  line: 1,
                  column: 27,
                },
                end: {
                  offset: 30,
                  line: 1,
                  column: 31,
                },
              },
            },
            {
              entityName: "normal",
              isComposite: false,
              cardinality: "N",
              participation: "partial",
              location: {
                start: {
                  offset: 32,
                  line: 1,
                  column: 33,
                },
                end: {
                  offset: 38,
                  line: 1,
                  column: 39,
                },
              },
            },
          ],
          location: {
            start: {
              offset: 17,
              line: 1,
              column: 18,
            },
            end: {
              offset: 39,
              line: 1,
              column: 40,
            },
          },
        },
      ],
      attributes: [],
      location: {
        start: {
          offset: 0,
          line: 1,
          column: 1,
        },
        end: {
          offset: 40,
          line: 1,
          column: 41,
        },
      },
    },
  ],
  aggregations: [
    {
      type: "aggregation",
      name: "RelatesToEntity",
      aggregatedRelationshipName: "Relates",
      location: {
        start: {
          offset: 41,
          line: 2,
          column: 1,
        },
        end: {
          offset: 77,
          line: 2,
          column: 37,
        },
      },
    },
  ],
};
