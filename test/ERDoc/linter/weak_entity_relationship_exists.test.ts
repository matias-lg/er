import { ER } from "../../../src/ERDoc/types/parser/ER";
import { checkWeakEntityRelationshipExists } from "../../../src/ERDoc/linter/entity/checkWeakEntityRelationshipExists";

describe("Checks weak entities depend on existing relationships", () => {
  it("Detects missing relationship of a weak entity", () => {
    const errors = checkWeakEntityRelationshipExists(missingRelationshipER);
    expect(errors.length).toBe(1);
    expect(errors[0].entityName).toBe("Car");
    expect(errors[0].relationshipName).toBe("Drives");
    expect(errors[0].location).toEqual({
      start: {
        offset: 0,
        line: 1,
        column: 1,
      },
      end: {
        offset: 78,
        line: 5,
        column: 2,
      },
    });
  });

  it("Detects no errors when relationship is present", () => {
    const errors = checkWeakEntityRelationshipExists(correctER);
    expect(errors.length).toBe(0);
  });
});

/*
entity Car depends on Drives {
    Max_speed pkey
    Brand
    N_passengers
}

relation Makes(Car, Company)
*/
const missingRelationshipER: ER = {
  entities: [
    {
      type: "entity",
      name: "Car",
      attributes: [
        {
          name: "Max_speed",
          location: {
            start: {
              offset: 35,
              line: 2,
              column: 5,
            },
            end: {
              offset: 49,
              line: 2,
              column: 19,
            },
          },
          isKey: true,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "Brand",
          location: {
            start: {
              offset: 54,
              line: 3,
              column: 5,
            },
            end: {
              offset: 59,
              line: 3,
              column: 10,
            },
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "N_passengers",
          location: {
            start: {
              offset: 64,
              line: 4,
              column: 5,
            },
            end: {
              offset: 76,
              line: 4,
              column: 17,
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
        relationshipName: "Drives",
      },
      location: {
        start: {
          offset: 0,
          line: 1,
          column: 1,
        },
        end: {
          offset: 78,
          line: 5,
          column: 2,
        },
      },
    },
  ],
  relationships: [
    {
      type: "relationship",
      name: "Makes",
      participantEntities: [
        {
          entityName: "Car",
          isComposite: false,
          cardinality: "N",
          participation: "partial",
          location: {
            start: {
              offset: 95,
              line: 7,
              column: 16,
            },
            end: {
              offset: 98,
              line: 7,
              column: 19,
            },
          },
        },
        {
          entityName: "Company",
          isComposite: false,
          cardinality: "N",
          participation: "partial",
          location: {
            start: {
              offset: 100,
              line: 7,
              column: 21,
            },
            end: {
              offset: 107,
              line: 7,
              column: 28,
            },
          },
        },
      ],
      attributes: [],
      location: {
        start: {
          offset: 80,
          line: 7,
          column: 1,
        },
        end: {
          offset: 108,
          line: 7,
          column: 29,
        },
      },
    },
  ],
  aggregations: [],
};

/*
entity Car depends on Drives {
    Max_speed pkey
    Brand
    N_passengers
}

relation Drives(Car, Human) {
    traveled_kms
}
*/
const correctER: ER = {
  entities: [
    {
      type: "entity",
      name: "Car",
      attributes: [
        {
          name: "Max_speed",
          location: {
            start: {
              offset: 35,
              line: 2,
              column: 5,
            },
            end: {
              offset: 49,
              line: 2,
              column: 19,
            },
          },
          isKey: true,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "Brand",
          location: {
            start: {
              offset: 54,
              line: 3,
              column: 5,
            },
            end: {
              offset: 59,
              line: 3,
              column: 10,
            },
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "N_passengers",
          location: {
            start: {
              offset: 64,
              line: 4,
              column: 5,
            },
            end: {
              offset: 76,
              line: 4,
              column: 17,
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
        relationshipName: "Drives",
      },
      location: {
        start: {
          offset: 0,
          line: 1,
          column: 1,
        },
        end: {
          offset: 78,
          line: 5,
          column: 2,
        },
      },
    },
  ],
  relationships: [
    {
      type: "relationship",
      name: "Drives",
      participantEntities: [
        {
          entityName: "Car",
          isComposite: false,
          cardinality: "N",
          participation: "partial",
          location: {
            start: {
              offset: 96,
              line: 7,
              column: 17,
            },
            end: {
              offset: 99,
              line: 7,
              column: 20,
            },
          },
        },
        {
          entityName: "Human",
          isComposite: false,
          cardinality: "N",
          participation: "partial",
          location: {
            start: {
              offset: 101,
              line: 7,
              column: 22,
            },
            end: {
              offset: 106,
              line: 7,
              column: 27,
            },
          },
        },
      ],
      attributes: [
        {
          name: "traveled_kms",
          isComposite: false,
          childAttributesNames: null,
          location: {
            start: {
              offset: 114,
              line: 8,
              column: 5,
            },
            end: {
              offset: 126,
              line: 8,
              column: 17,
            },
          },
        },
      ],
      location: {
        start: {
          offset: 80,
          line: 7,
          column: 1,
        },
        end: {
          offset: 128,
          line: 9,
          column: 2,
        },
      },
    },
  ],
  aggregations: [],
};
