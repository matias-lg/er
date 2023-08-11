import { ER } from "../../src/types/parser/ER";
import { SemanticErrorType } from "../../src/types/linter/SemanticError";
import { checkRelationshipDuplicate } from "../../src/linter/checkRelationshipDuplicate";

describe("Linter checks for duplicate relationships", () => {
  it("detects two duplicate relationships", () => {
    const er: ER = duplicateRelationshipER;
    const errors = checkRelationshipDuplicate(er);
    expect(errors.length).toBe(1);
    expect(errors[0].type).toBe(SemanticErrorType.RELATIONSHIP_DUPLICATE);
    expect(errors[0].relationshipName).toBe("Owns");
    expect(errors[0].location).toEqual({
      start: {
        offset: 28,
        line: 2,
        column: 1,
      },
      end: {
        offset: 55,
        line: 2,
        column: 28,
      },
    });
  });

  it("detects duplicate relationship with a multivalued participant", () => {
    const er: ER = duplicateRelationshipMultivalER;
    const errors = checkRelationshipDuplicate(er);
    expect(errors.length).toBe(1);
    expect(errors[0].type).toBe(SemanticErrorType.RELATIONSHIP_DUPLICATE);
    expect(errors[0].relationshipName).toBe("Owns");
  });

  it("no errors when two relationships have the same name but different participants", () => {
    const er: ER = sameNameDIfferentParticipantER;
    const errors = checkRelationshipDuplicate(er);
    expect(errors.length).toBe(0);
  });

  it("no errors when two relationships have different names", () => {
    const er: ER = differentRelationshipsER;
    const errors = checkRelationshipDuplicate(er);
    expect(errors.length).toBe(0);
  });
});

/*
relation Owns(Human, House)
relation Owns(Human, House)
*/
const duplicateRelationshipER: ER = {
  entities: [],
  relationships: [
    {
      type: "relationship",
      name: "Owns",
      participantEntities: [
        {
          entityName: "Human",
          isComposite: false,
          cardinality: "N",
          participation: "partial",
          location: {
            start: {
              offset: 14,
              line: 1,
              column: 15,
            },
            end: {
              offset: 19,
              line: 1,
              column: 20,
            },
          },
        },
        {
          entityName: "House",
          isComposite: false,
          cardinality: "N",
          participation: "partial",
          location: {
            start: {
              offset: 21,
              line: 1,
              column: 22,
            },
            end: {
              offset: 26,
              line: 1,
              column: 27,
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
          offset: 27,
          line: 1,
          column: 28,
        },
      },
    },
    {
      type: "relationship",
      name: "Owns",
      participantEntities: [
        {
          entityName: "Human",
          isComposite: false,
          cardinality: "N",
          participation: "partial",
          location: {
            start: {
              offset: 42,
              line: 2,
              column: 15,
            },
            end: {
              offset: 47,
              line: 2,
              column: 20,
            },
          },
        },
        {
          entityName: "House",
          isComposite: false,
          cardinality: "N",
          participation: "partial",
          location: {
            start: {
              offset: 49,
              line: 2,
              column: 22,
            },
            end: {
              offset: 54,
              line: 2,
              column: 27,
            },
          },
        },
      ],
      attributes: [],
      location: {
        start: {
          offset: 28,
          line: 2,
          column: 1,
        },
        end: {
          offset: 55,
          line: 2,
          column: 28,
        },
      },
    },
  ],
  aggregations: [],
};

/*
relation Owns(Human, House)
relation Owns(Human, House: [SingleFloorHouse, WoodenFloorHouse])
*/
const duplicateRelationshipMultivalER: ER = {
  entities: [],
  relationships: [
    {
      type: "relationship",
      name: "Owns",
      participantEntities: [
        {
          entityName: "Human",
          isComposite: false,
          cardinality: "N",
          participation: "partial",
          location: {
            start: {
              offset: 14,
              line: 1,
              column: 15,
            },
            end: {
              offset: 19,
              line: 1,
              column: 20,
            },
          },
        },
        {
          entityName: "House",
          isComposite: false,
          cardinality: "N",
          participation: "partial",
          location: {
            start: {
              offset: 21,
              line: 1,
              column: 22,
            },
            end: {
              offset: 26,
              line: 1,
              column: 27,
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
          offset: 27,
          line: 1,
          column: 28,
        },
      },
    },
    {
      type: "relationship",
      name: "Owns",
      participantEntities: [
        {
          entityName: "Human",
          isComposite: false,
          cardinality: "N",
          participation: "partial",
          location: {
            start: {
              offset: 42,
              line: 2,
              column: 15,
            },
            end: {
              offset: 47,
              line: 2,
              column: 20,
            },
          },
        },
        {
          entityName: "House",
          isComposite: true,
          childParticipants: [
            {
              entityName: "SingleFloorHouse",
              isComposite: false,
              cardinality: "N",
              participation: "partial",
              location: {
                start: {
                  offset: 57,
                  line: 2,
                  column: 30,
                },
                end: {
                  offset: 73,
                  line: 2,
                  column: 46,
                },
              },
            },
            {
              entityName: "WoodenFloorHouse",
              isComposite: false,
              cardinality: "N",
              participation: "partial",
              location: {
                start: {
                  offset: 75,
                  line: 2,
                  column: 48,
                },
                end: {
                  offset: 91,
                  line: 2,
                  column: 64,
                },
              },
            },
          ],
          location: {
            start: {
              offset: 49,
              line: 2,
              column: 22,
            },
            end: {
              offset: 92,
              line: 2,
              column: 65,
            },
          },
        },
      ],
      attributes: [],
      location: {
        start: {
          offset: 28,
          line: 2,
          column: 1,
        },
        end: {
          offset: 93,
          line: 2,
          column: 66,
        },
      },
    },
  ],
  aggregations: [],
};

/*
relation Owns(Human, House)
relation Owns(Human, Car)
*/
const sameNameDIfferentParticipantER: ER = {
  entities: [],
  relationships: [
    {
      type: "relationship",
      name: "Owns",
      participantEntities: [
        {
          entityName: "Human",
          isComposite: false,
          cardinality: "N",
          participation: "partial",
          location: {
            start: {
              offset: 14,
              line: 1,
              column: 15,
            },
            end: {
              offset: 19,
              line: 1,
              column: 20,
            },
          },
        },
        {
          entityName: "House",
          isComposite: false,
          cardinality: "N",
          participation: "partial",
          location: {
            start: {
              offset: 21,
              line: 1,
              column: 22,
            },
            end: {
              offset: 26,
              line: 1,
              column: 27,
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
          offset: 27,
          line: 1,
          column: 28,
        },
      },
    },
    {
      type: "relationship",
      name: "Owns",
      participantEntities: [
        {
          entityName: "Human",
          isComposite: false,
          cardinality: "N",
          participation: "partial",
          location: {
            start: {
              offset: 42,
              line: 2,
              column: 15,
            },
            end: {
              offset: 47,
              line: 2,
              column: 20,
            },
          },
        },
        {
          entityName: "Car",
          isComposite: false,
          cardinality: "N",
          participation: "partial",
          location: {
            start: {
              offset: 49,
              line: 2,
              column: 22,
            },
            end: {
              offset: 52,
              line: 2,
              column: 25,
            },
          },
        },
      ],
      attributes: [],
      location: {
        start: {
          offset: 28,
          line: 2,
          column: 1,
        },
        end: {
          offset: 53,
          line: 2,
          column: 26,
        },
      },
    },
  ],
  aggregations: [],
};

/*
relation Owns(Human, House)
relation DancesTo(Human, Music)
*/
const differentRelationshipsER: ER = {
  entities: [],
  relationships: [
    {
      type: "relationship",
      name: "Owns",
      participantEntities: [
        {
          entityName: "Human",
          isComposite: false,
          cardinality: "N",
          participation: "partial",
          location: {
            start: {
              offset: 14,
              line: 1,
              column: 15,
            },
            end: {
              offset: 19,
              line: 1,
              column: 20,
            },
          },
        },
        {
          entityName: "House",
          isComposite: false,
          cardinality: "N",
          participation: "partial",
          location: {
            start: {
              offset: 21,
              line: 1,
              column: 22,
            },
            end: {
              offset: 26,
              line: 1,
              column: 27,
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
          offset: 27,
          line: 1,
          column: 28,
        },
      },
    },
    {
      type: "relationship",
      name: "DancesTo",
      participantEntities: [
        {
          entityName: "Human",
          isComposite: false,
          cardinality: "N",
          participation: "partial",
          location: {
            start: {
              offset: 46,
              line: 2,
              column: 19,
            },
            end: {
              offset: 51,
              line: 2,
              column: 24,
            },
          },
        },
        {
          entityName: "Music",
          isComposite: false,
          cardinality: "N",
          participation: "partial",
          location: {
            start: {
              offset: 53,
              line: 2,
              column: 26,
            },
            end: {
              offset: 58,
              line: 2,
              column: 31,
            },
          },
        },
      ],
      attributes: [],
      location: {
        start: {
          offset: 28,
          line: 2,
          column: 1,
        },
        end: {
          offset: 59,
          line: 2,
          column: 32,
        },
      },
    },
  ],
  aggregations: [],
};
