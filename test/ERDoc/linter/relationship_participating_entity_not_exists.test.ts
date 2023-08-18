import { ER } from "../../../src/ERDoc/types/parser/ER";
import { checkRelationshipParticipatingEntityNotExists } from "../../../src/ERDoc/linter/relationship/checkRelationshipParticipatingEntityNotExists";

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

  it("Returns no errors when an aggregation exists", () => {
    const errors = checkRelationshipParticipatingEntityNotExists(
      correctERWithAggregation,
    );
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

/*
entity grinder {
  model_id key
  brand
  rpm
}

entity barista {
  RUT key
  name
}

relation uses(barista, grinder)
aggregation barista_uses_grinder(uses)

entity coffee{
  country_of_origin key
  species key
  roast_date key
  rating
}
relation grinds(coffee, barista_uses_grinder)
*/
const correctERWithAggregation: ER = {
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
      name: "barista",
      attributes: [
        {
          name: "RUT",
          location: {
            start: {
              offset: 68,
              line: 8,
              column: 3,
            },
            end: {
              offset: 75,
              line: 8,
              column: 10,
            },
          },
          isKey: true,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "name",
          location: {
            start: {
              offset: 78,
              line: 9,
              column: 3,
            },
            end: {
              offset: 82,
              line: 9,
              column: 7,
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
          offset: 49,
          line: 7,
          column: 1,
        },
        end: {
          offset: 84,
          line: 10,
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
              offset: 175,
              line: 16,
              column: 3,
            },
            end: {
              offset: 196,
              line: 16,
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
              offset: 199,
              line: 17,
              column: 3,
            },
            end: {
              offset: 210,
              line: 17,
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
              offset: 213,
              line: 18,
              column: 3,
            },
            end: {
              offset: 227,
              line: 18,
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
              offset: 230,
              line: 19,
              column: 3,
            },
            end: {
              offset: 236,
              line: 19,
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
          offset: 158,
          line: 15,
          column: 1,
        },
        end: {
          offset: 238,
          line: 20,
          column: 2,
        },
      },
    },
  ],
  relationships: [
    {
      type: "relationship",
      name: "uses",
      participantEntities: [
        {
          entityName: "barista",
          isComposite: false,
          cardinality: "N",
          participation: "partial",
          location: {
            start: {
              offset: 100,
              line: 12,
              column: 15,
            },
            end: {
              offset: 107,
              line: 12,
              column: 22,
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
              offset: 109,
              line: 12,
              column: 24,
            },
            end: {
              offset: 116,
              line: 12,
              column: 31,
            },
          },
        },
      ],
      attributes: [],
      location: {
        start: {
          offset: 86,
          line: 12,
          column: 1,
        },
        end: {
          offset: 117,
          line: 12,
          column: 32,
        },
      },
    },
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
              offset: 255,
              line: 21,
              column: 17,
            },
            end: {
              offset: 261,
              line: 21,
              column: 23,
            },
          },
        },
        {
          entityName: "barista_uses_grinder",
          isComposite: false,
          cardinality: "N",
          participation: "partial",
          location: {
            start: {
              offset: 263,
              line: 21,
              column: 25,
            },
            end: {
              offset: 283,
              line: 21,
              column: 45,
            },
          },
        },
      ],
      attributes: [],
      location: {
        start: {
          offset: 239,
          line: 21,
          column: 1,
        },
        end: {
          offset: 284,
          line: 21,
          column: 46,
        },
      },
    },
  ],
  aggregations: [
    {
      type: "aggregation",
      name: "barista_uses_grinder",
      aggregatedRelationshipName: "uses",
      location: {
        start: {
          offset: 118,
          line: 13,
          column: 1,
        },
        end: {
          offset: 156,
          line: 13,
          column: 39,
        },
      },
    },
  ],
};
