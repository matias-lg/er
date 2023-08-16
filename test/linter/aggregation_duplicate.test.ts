import { ER } from "../../src/types/parser/ER";
import { checkAggregationDuplicate } from "../../src/linter/aggregation/checkAggregationDuplicate";

describe("Linter detects duplicate aggregations", () => {
  it("Detects a duplicate aggregation", () => {
    const errors = checkAggregationDuplicate(duplicateAggregation);
    expect(errors.length).toBe(1);
    expect(errors[0].type).toBe("AGGREGATION_DUPLICATE");
    expect(errors[0].aggregationName).toBe("profesor_dicta_curso");
    expect(errors[0].location).toEqual({
      start: {
        offset: 40,
        line: 2,
        column: 1,
      },
      end: {
        offset: 79,
        line: 2,
        column: 40,
      },
    });
  });

  it("Detects no errors with different aggregations", () => {
    const errors = checkAggregationDuplicate(noDuplicateER);
    expect(errors.length).toBe(0);
  });

  it("Detects no errors with a single aggregation", () => {
    const errors = checkAggregationDuplicate(singleAggregationER);
    expect(errors.length).toBe(0);
  });

  it("Detects multiple duplicate aggregations", () => {
    const errors = checkAggregationDuplicate(multiWrongER);
    expect(errors.length).toBe(2);
  });
});

/*
aggregation profesor_dicta_curso(Dicta)
aggregation profesor_dicta_curso(Dicta)
*/
const duplicateAggregation: ER = {
  entities: [],
  relationships: [],
  aggregations: [
    {
      type: "aggregation",
      name: "profesor_dicta_curso",
      aggregatedRelationshipName: "Dicta",
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
      name: "profesor_dicta_curso",
      aggregatedRelationshipName: "Dicta",
      location: {
        start: {
          offset: 40,
          line: 2,
          column: 1,
        },
        end: {
          offset: 79,
          line: 2,
          column: 40,
        },
      },
    },
  ],
};

/*
aggregation profesor_teaches_course(Teaches)
aggregation DudeSellsCar(Sells)
*/
const noDuplicateER: ER = {
  entities: [],
  relationships: [],
  aggregations: [
    {
      type: "aggregation",
      name: "profesor_teaches_course",
      aggregatedRelationshipName: "Teaches",
      location: {
        start: {
          offset: 0,
          line: 1,
          column: 1,
        },
        end: {
          offset: 44,
          line: 1,
          column: 45,
        },
      },
    },
    {
      type: "aggregation",
      name: "DudeSellsCar",
      aggregatedRelationshipName: "Sells",
      location: {
        start: {
          offset: 45,
          line: 2,
          column: 1,
        },
        end: {
          offset: 76,
          line: 2,
          column: 32,
        },
      },
    },
  ],
};

/*aggregation profesor_dicta_curso(Dicta)*/
const singleAggregationER: ER = {
  entities: [],
  relationships: [],
  aggregations: [
    {
      type: "aggregation",
      name: "profesor_dicta_curso",
      aggregatedRelationshipName: "Dicta",
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
  ],
};

/*
aggregation profesor_teaches_course(Teaches)
aggregation DudeSellsCar(Sells)
aggregation profesor_teaches_course(Teaches)
aggregation DudeSellsCar(Sells)
*/
const multiWrongER: ER = {
  entities: [],
  relationships: [],
  aggregations: [
    {
      type: "aggregation",
      name: "profesor_teaches_course",
      aggregatedRelationshipName: "Teaches",
      location: {
        start: {
          offset: 0,
          line: 1,
          column: 1,
        },
        end: {
          offset: 44,
          line: 1,
          column: 45,
        },
      },
    },
    {
      type: "aggregation",
      name: "DudeSellsCar",
      aggregatedRelationshipName: "Sells",
      location: {
        start: {
          offset: 45,
          line: 2,
          column: 1,
        },
        end: {
          offset: 76,
          line: 2,
          column: 32,
        },
      },
    },
    {
      type: "aggregation",
      name: "profesor_teaches_course",
      aggregatedRelationshipName: "Teaches",
      location: {
        start: {
          offset: 77,
          line: 3,
          column: 1,
        },
        end: {
          offset: 121,
          line: 3,
          column: 45,
        },
      },
    },
    {
      type: "aggregation",
      name: "DudeSellsCar",
      aggregatedRelationshipName: "Sells",
      location: {
        start: {
          offset: 122,
          line: 4,
          column: 1,
        },
        end: {
          offset: 153,
          line: 4,
          column: 32,
        },
      },
    },
  ],
};
