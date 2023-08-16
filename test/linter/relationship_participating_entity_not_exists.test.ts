import { ER } from "../../src/types/parser/ER";
import { checkRelationshipParticipatingEntityNotExists } from "../../src/linter/relationship/checkRelationshipParticipatingEntityNotExists";

describe("Linter detects entities that are participating in a relationship but do not exist", () => {
  it("Returns an error when entity doesn't exist", () => {
    const errors = checkRelationshipParticipatingEntityNotExists(wrongER);
    expect(errors.length).toBe(1);
    expect(errors[0].type).toBe("RELATIONSHIP_PARTICIPATING_ENTITY_NOT_EXISTS");
    expect(errors[0].relationshipName).toBe("grinds");
    expect(errors[0].entityName).toBe("coffee");
    expect(errors[0].location).toEqual({
      start: {
        offset: 64,
        line: 6,
        column: 17,
      },
      end: {
        offset: 70,
        line: 6,
        column: 23,
      },
    });
  });

  it("Returns more than one error when multiple entities don't exist", () => {
    const errors = checkRelationshipParticipatingEntityNotExists(wrongER2);
    expect(errors.length).toBe(2);
    expect(errors.some((e) => e.entityName === "coffee")).toBe(true);
    expect(errors.some((e) => e.entityName === "barista")).toBe(true);
  });

  it("Returns no errors when all entities exist", () => {
    const errors = checkRelationshipParticipatingEntityNotExists(correctER);
    expect(errors.length).toBe(0);
  });
});

/*
entity grinder {
  model_id key
  brand
  rpm
}
relation grinds(coffee, grinder)
*/
const wrongER: ER = {
  entities: [
    {
      type: "entity",
      name: "grinder",
      attributes: [
        {
          name: "model_id",
          location: {
            start: {
              offset: 19,
              line: 2,
              column: 3,
            },
            end: {
              offset: 31,
              line: 2,
              column: 15,
            },
          },
          isKey: true,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "brand",
          location: {
            start: {
              offset: 34,
              line: 3,
              column: 3,
            },
            end: {
              offset: 39,
              line: 3,
              column: 8,
            },
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "rpm",
          location: {
            start: {
              offset: 42,
              line: 4,
              column: 3,
            },
            end: {
              offset: 45,
              line: 4,
              column: 6,
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
          offset: 47,
          line: 5,
          column: 2,
        },
      },
    },
  ],
  relationships: [
    {
      type: "relationship",
      name: "grinds",
      participantEntities: [
        {
          entityName: "coffee",
          isComposite: false,
          cardinality: "N",
          participation: "partial",
          location: {
            start: {
              offset: 64,
              line: 6,
              column: 17,
            },
            end: {
              offset: 70,
              line: 6,
              column: 23,
            },
          },
        },
        {
          entityName: "grinder",
          isComposite: false,
          cardinality: "N",
          participation: "partial",
          location: {
            start: {
              offset: 72,
              line: 6,
              column: 25,
            },
            end: {
              offset: 79,
              line: 6,
              column: 32,
            },
          },
        },
      ],
      attributes: [],
      location: {
        start: {
          offset: 48,
          line: 6,
          column: 1,
        },
        end: {
          offset: 80,
          line: 6,
          column: 33,
        },
      },
    },
  ],
  aggregations: [],
};
/*
entity grinder {
  model_id key
  brand
  rpm
}
relation grinds(coffee, grinder, barista)
*/
const wrongER2: ER = {
  entities: [
    {
      type: "entity",
      name: "grinder",
      attributes: [
        {
          name: "model_id",
          location: {
            start: {
              offset: 19,
              line: 2,
              column: 3,
            },
            end: {
              offset: 31,
              line: 2,
              column: 15,
            },
          },
          isKey: true,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "brand",
          location: {
            start: {
              offset: 34,
              line: 3,
              column: 3,
            },
            end: {
              offset: 39,
              line: 3,
              column: 8,
            },
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "rpm",
          location: {
            start: {
              offset: 42,
              line: 4,
              column: 3,
            },
            end: {
              offset: 45,
              line: 4,
              column: 6,
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
          offset: 47,
          line: 5,
          column: 2,
        },
      },
    },
  ],
  relationships: [
    {
      type: "relationship",
      name: "grinds",
      participantEntities: [
        {
          entityName: "coffee",
          isComposite: false,
          cardinality: "N",
          participation: "partial",
          location: {
            start: {
              offset: 64,
              line: 6,
              column: 17,
            },
            end: {
              offset: 70,
              line: 6,
              column: 23,
            },
          },
        },
        {
          entityName: "grinder",
          isComposite: false,
          cardinality: "N",
          participation: "partial",
          location: {
            start: {
              offset: 72,
              line: 6,
              column: 25,
            },
            end: {
              offset: 79,
              line: 6,
              column: 32,
            },
          },
        },
        {
          entityName: "barista",
          isComposite: false,
          cardinality: "N",
          participation: "partial",
          location: {
            start: {
              offset: 81,
              line: 6,
              column: 34,
            },
            end: {
              offset: 88,
              line: 6,
              column: 41,
            },
          },
        },
      ],
      attributes: [],
      location: {
        start: {
          offset: 48,
          line: 6,
          column: 1,
        },
        end: {
          offset: 89,
          line: 6,
          column: 42,
        },
      },
    },
  ],
  aggregations: [],
};

/*
entity grinder {
  model_id key
  brand
  rpm
}
entity coffee{
  country_of_origin key
  species key
  roast_date key
  rating
}
relation grinds(coffee, grinder)
*/
const correctER: ER = {
  entities: [
    {
      type: "entity",
      name: "grinder",
      attributes: [
        {
          name: "model_id",
          location: {
            start: {
              offset: 19,
              line: 2,
              column: 3,
            },
            end: {
              offset: 31,
              line: 2,
              column: 15,
            },
          },
          isKey: true,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "brand",
          location: {
            start: {
              offset: 34,
              line: 3,
              column: 3,
            },
            end: {
              offset: 39,
              line: 3,
              column: 8,
            },
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "rpm",
          location: {
            start: {
              offset: 42,
              line: 4,
              column: 3,
            },
            end: {
              offset: 45,
              line: 4,
              column: 6,
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
          offset: 47,
          line: 5,
          column: 2,
        },
      },
    },
    {
      type: "entity",
      name: "coffee",
      attributes: [
        {
          name: "country_of_origin",
          location: {
            start: {
              offset: 65,
              line: 7,
              column: 3,
            },
            end: {
              offset: 86,
              line: 7,
              column: 24,
            },
          },
          isKey: true,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "species",
          location: {
            start: {
              offset: 89,
              line: 8,
              column: 3,
            },
            end: {
              offset: 100,
              line: 8,
              column: 14,
            },
          },
          isKey: true,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "roast_date",
          location: {
            start: {
              offset: 103,
              line: 9,
              column: 3,
            },
            end: {
              offset: 117,
              line: 9,
              column: 17,
            },
          },
          isKey: true,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "rating",
          location: {
            start: {
              offset: 120,
              line: 10,
              column: 3,
            },
            end: {
              offset: 126,
              line: 10,
              column: 9,
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
          offset: 48,
          line: 6,
          column: 1,
        },
        end: {
          offset: 128,
          line: 11,
          column: 2,
        },
      },
    },
  ],
  relationships: [
    {
      type: "relationship",
      name: "grinds",
      participantEntities: [
        {
          entityName: "coffee",
          isComposite: false,
          cardinality: "N",
          participation: "partial",
          location: {
            start: {
              offset: 145,
              line: 12,
              column: 17,
            },
            end: {
              offset: 151,
              line: 12,
              column: 23,
            },
          },
        },
        {
          entityName: "grinder",
          isComposite: false,
          cardinality: "N",
          participation: "partial",
          location: {
            start: {
              offset: 153,
              line: 12,
              column: 25,
            },
            end: {
              offset: 160,
              line: 12,
              column: 32,
            },
          },
        },
      ],
      attributes: [],
      location: {
        start: {
          offset: 129,
          line: 12,
          column: 1,
        },
        end: {
          offset: 161,
          line: 12,
          column: 33,
        },
      },
    },
  ],
  aggregations: [],
};
