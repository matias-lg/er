import { ER } from "../../src/types/parser/ER";
import { checkAggregationUsesEntityName } from "../../src/linter/aggregation/checkAggregationUsesEntityName";

describe("Linter detects aggregations with same name as existing entity", () => {
  it("Detects aggregation with same name as existing entity", () => {
    const errors = checkAggregationUsesEntityName(EntityNameClashER);
    expect(errors.length).toBe(1);
    expect(errors[0].type).toBe("AGGREGATION_USES_ENTITY_NAME");
    expect(errors[0].aggregationName).toBe("profesor_dicta_curso");
  });
});

/*
entity profesor_dicta_curso {
  id key
  materia
}

aggregation profesor_dicta_curso(Dicta)
*/
const EntityNameClashER: ER = {
  entities: [
    {
      type: "entity",
      name: "profesor_dicta_curso",
      attributes: [
        {
          name: "id",
          location: {
            start: {
              offset: 32,
              line: 2,
              column: 3,
            },
            end: {
              offset: 38,
              line: 2,
              column: 9,
            },
          },
          isKey: true,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "materia",
          location: {
            start: {
              offset: 41,
              line: 3,
              column: 3,
            },
            end: {
              offset: 48,
              line: 3,
              column: 10,
            },
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null,
        },
      ],
      hasParent: false,
      parentName: null,
      hasDependencies: false,
      dependsOn: null,
      location: {
        start: {
          offset: 0,
          line: 1,
          column: 1,
        },
        end: {
          offset: 50,
          line: 4,
          column: 2,
        },
      },
    },
  ],
  relationships: [],
  aggregations: [
    {
      type: "aggregation",
      name: "profesor_dicta_curso",
      aggregatedRelationshipName: "Dicta",
      location: {
        start: {
          offset: 52,
          line: 6,
          column: 1,
        },
        end: {
          offset: 91,
          line: 6,
          column: 40,
        },
      },
    },
  ],
};
