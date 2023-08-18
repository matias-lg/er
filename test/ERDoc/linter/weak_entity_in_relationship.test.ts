import { ER } from "../../../src/ERDoc/types/parser/ER";
import { checkWeakEntityInRelationship } from "../../../src/ERDoc/linter/entity/checkWeakEntityInRelationship";

describe("Linter detects that a weak entity must participate in its identifying relationship", () => {
  it("Finds an error when a weak entity doesn't participate in its identifying relationship", () => {
    const errors = checkWeakEntityInRelationship(missingWeakEntER);
    expect(errors.length).toBe(1);
    expect(errors[0].entityName).toBe("Sun");
    expect(errors[0].relationshipName).toBe("BelongsTo");
    expect(errors[0].location).toEqual({
      start: {
        offset: 0,
        line: 1,
        column: 1,
      },
      end: {
        offset: 63,
        line: 4,
        column: 2,
      },
    });
  });

  it("Finds no error when the relationship is missing", () => {
    const errors = checkWeakEntityInRelationship(missingRelationshipER);
    expect(errors.length).toBe(0);
  });

  it("Finds no error in a correct ER", () => {
    const errors = checkWeakEntityInRelationship(correctER);
    expect(errors.length).toBe(0);
  });
});

/*
entity Sun depends on BelongsTo {
    id pkey
    temperature
}

relation BelongsTo(Earth)
*/
const missingWeakEntER: ER = {
  entities: [
    {
      type: "entity",
      name: "Sun",
      attributes: [
        {
          name: "id",
          location: {
            start: {
              offset: 38,
              line: 2,
              column: 5,
            },
            end: {
              offset: 45,
              line: 2,
              column: 12,
            },
          },
          isKey: true,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "temperature",
          location: {
            start: {
              offset: 50,
              line: 3,
              column: 5,
            },
            end: {
              offset: 61,
              line: 3,
              column: 16,
            },
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null,
        },
      ],
      hasParent: false,
      parentName: null,
      hasDependencies: true,
      dependsOn: {
        relationshipName: "BelongsTo",
      },
      location: {
        start: {
          offset: 0,
          line: 1,
          column: 1,
        },
        end: {
          offset: 63,
          line: 4,
          column: 2,
        },
      },
    },
  ],
  relationships: [
    {
      type: "relationship",
      name: "BelongsTo",
      participantEntities: [
        {
          entityName: "Earth",
          isComposite: false,
          cardinality: "N",
          participation: "partial",
          location: {
            start: {
              offset: 84,
              line: 6,
              column: 20,
            },
            end: {
              offset: 89,
              line: 6,
              column: 25,
            },
          },
        },
      ],
      attributes: [],
      location: {
        start: {
          offset: 65,
          line: 6,
          column: 1,
        },
        end: {
          offset: 90,
          line: 6,
          column: 26,
        },
      },
    },
  ],
  aggregations: [],
};

/*
entity Sun depends on BelongsTo {
    id pkey
    temperature
}
*/
const missingRelationshipER: ER = {
  entities: [
    {
      type: "entity",
      name: "Sun",
      attributes: [
        {
          name: "id",
          location: {
            start: {
              offset: 38,
              line: 2,
              column: 5,
            },
            end: {
              offset: 45,
              line: 2,
              column: 12,
            },
          },
          isKey: true,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "temperature",
          location: {
            start: {
              offset: 50,
              line: 3,
              column: 5,
            },
            end: {
              offset: 61,
              line: 3,
              column: 16,
            },
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null,
        },
      ],
      hasParent: false,
      parentName: null,
      hasDependencies: true,
      dependsOn: {
        relationshipName: "BelongsTo",
      },
      location: {
        start: {
          offset: 0,
          line: 1,
          column: 1,
        },
        end: {
          offset: 63,
          line: 4,
          column: 2,
        },
      },
    },
  ],
  relationships: [],
  aggregations: [],
};

/*
entity Sun depends on BelongsTo {
    id pkey
    temperature
}

relation BelongsTo(Earth, Sun)
*/
const correctER: ER = {
  entities: [
    {
      type: "entity",
      name: "Sun",
      attributes: [
        {
          name: "id",
          location: {
            start: {
              offset: 38,
              line: 2,
              column: 5,
            },
            end: {
              offset: 45,
              line: 2,
              column: 12,
            },
          },
          isKey: true,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "temperature",
          location: {
            start: {
              offset: 50,
              line: 3,
              column: 5,
            },
            end: {
              offset: 61,
              line: 3,
              column: 16,
            },
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null,
        },
      ],
      hasParent: false,
      parentName: null,
      hasDependencies: true,
      dependsOn: {
        relationshipName: "BelongsTo",
      },
      location: {
        start: {
          offset: 0,
          line: 1,
          column: 1,
        },
        end: {
          offset: 63,
          line: 4,
          column: 2,
        },
      },
    },
  ],
  relationships: [
    {
      type: "relationship",
      name: "BelongsTo",
      participantEntities: [
        {
          entityName: "Earth",
          isComposite: false,
          cardinality: "N",
          participation: "partial",
          location: {
            start: {
              offset: 84,
              line: 6,
              column: 20,
            },
            end: {
              offset: 89,
              line: 6,
              column: 25,
            },
          },
        },
        {
          entityName: "Sun",
          isComposite: false,
          cardinality: "N",
          participation: "partial",
          location: {
            start: {
              offset: 91,
              line: 6,
              column: 27,
            },
            end: {
              offset: 94,
              line: 6,
              column: 30,
            },
          },
        },
      ],
      attributes: [],
      location: {
        start: {
          offset: 65,
          line: 6,
          column: 1,
        },
        end: {
          offset: 95,
          line: 6,
          column: 31,
        },
      },
    },
  ],
  aggregations: [],
};
