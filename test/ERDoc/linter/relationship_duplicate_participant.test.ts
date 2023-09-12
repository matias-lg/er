import { ER } from "../../../src/ERDoc/types/parser/ER";
import { checkRelationshipDuplicateParticipant } from "../../../src/ERDoc/linter/relationship/checkRelationshipDuplicateParticipant";

describe("Linter detects duplicate relationship participating entities", () => {
  it("Detects a duplicate entity in a relationship", () => {
    const errors = checkRelationshipDuplicateParticipant(wrongER);
    expect(errors).toHaveLength(1);
    expect(errors[0].type).toBe("RELATIONSHIP_DUPLICATE_PARTICIPANT");
    expect(errors[0].entityName).toBe("Human");
    expect(errors[0].relationshipName).toBe("dances");
    expect(errors[0].location).toEqual({
      start: {
        offset: 23,
        line: 1,
        column: 24,
      },
      end: {
        offset: 28,
        line: 1,
        column: 29,
      },
    });
  });

  it("Detects a duplicate entity with roles in a relationship", () => {
    const errors = checkRelationshipDuplicateParticipant(wrongER2);
    expect(errors).toHaveLength(1);
    expect(errors[0].type).toBe("RELATIONSHIP_DUPLICATE_PARTICIPANT");
    expect(errors[0].entityName).toBe("Human");
    expect(errors[0].relationshipName).toBe("dances");
    expect(errors[0].location).toEqual({
      start: {
        offset: 23,
        line: 1,
        column: 24,
      },
      end: {
        offset: 47,
        line: 1,
        column: 48,
      },
    });
  });

  it("Detects duplicates in multiple relationships", () => {
    const errors = checkRelationshipDuplicateParticipant(MultiWrongER);
    expect(errors).toHaveLength(2);
    expect(
      errors.every((e) => e.type === "RELATIONSHIP_DUPLICATE_PARTICIPANT"),
    ).toBe(true);
    expect(errors.some((e) => e.relationshipName === "dances")).toBe(true);
    expect(errors.some((e) => e.relationshipName === "Races")).toBe(true);
    expect(errors.some((e) => e.entityName === "Human")).toBe(true);
    expect(errors.some((e) => e.entityName === "Car")).toBe(true);
  });

  it("should return no errors when there's no duplicate entity", () => {
    const errors = checkRelationshipDuplicateParticipant(correctER);
    expect(errors).toHaveLength(0);
  });

  it("should detect a duplicate participant when an entity has duplicate roles", () => {
    const errors = checkRelationshipDuplicateParticipant(duplicateRoleER);
    expect(errors).toHaveLength(1);
  });
});

/*
relation dances(Human, Human)
*/
const wrongER: ER = {
  entities: [],
  relationships: [
    {
      type: "relationship",
      name: "dances",
      participantEntities: [
        {
          entityName: "Human",
          isComposite: false,
          cardinality: "N",
          participation: "partial",
          location: {
            start: {
              offset: 16,
              line: 1,
              column: 17,
            },
            end: {
              offset: 21,
              line: 1,
              column: 22,
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
              offset: 23,
              line: 1,
              column: 24,
            },
            end: {
              offset: 28,
              line: 1,
              column: 29,
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
          offset: 29,
          line: 1,
          column: 30,
        },
      },
    },
  ],
  aggregations: [],
};

/*
relation dances(Human, Human: [dancer, partner])
*/
const wrongER2: ER = {
  entities: [],
  relationships: [
    {
      type: "relationship",
      name: "dances",
      participantEntities: [
        {
          entityName: "Human",
          isComposite: false,
          cardinality: "N",
          participation: "partial",
          location: {
            start: {
              offset: 16,
              line: 1,
              column: 17,
            },
            end: {
              offset: 21,
              line: 1,
              column: 22,
            },
          },
        },
        {
          entityName: "Human",
          isComposite: true,
          childParticipants: [
            {
              entityName: "dancer",
              isComposite: false,
              cardinality: "N",
              participation: "partial",
              location: {
                start: {
                  offset: 31,
                  line: 1,
                  column: 32,
                },
                end: {
                  offset: 37,
                  line: 1,
                  column: 38,
                },
              },
            },
            {
              entityName: "partner",
              isComposite: false,
              cardinality: "N",
              participation: "partial",
              location: {
                start: {
                  offset: 39,
                  line: 1,
                  column: 40,
                },
                end: {
                  offset: 46,
                  line: 1,
                  column: 47,
                },
              },
            },
          ],
          location: {
            start: {
              offset: 23,
              line: 1,
              column: 24,
            },
            end: {
              offset: 47,
              line: 1,
              column: 48,
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
          offset: 48,
          line: 1,
          column: 49,
        },
      },
    },
  ],
  aggregations: [],
};

/*
relation dances(Human, Human)
relation Races(Car, Car)
*/
const MultiWrongER: ER = {
  entities: [],
  relationships: [
    {
      type: "relationship",
      name: "dances",
      participantEntities: [
        {
          entityName: "Human",
          isComposite: false,
          cardinality: "N",
          participation: "partial",
          location: {
            start: {
              offset: 16,
              line: 1,
              column: 17,
            },
            end: {
              offset: 21,
              line: 1,
              column: 22,
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
              offset: 23,
              line: 1,
              column: 24,
            },
            end: {
              offset: 28,
              line: 1,
              column: 29,
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
          offset: 29,
          line: 1,
          column: 30,
        },
      },
    },
    {
      type: "relationship",
      name: "Races",
      participantEntities: [
        {
          entityName: "Car",
          isComposite: false,
          cardinality: "N",
          participation: "partial",
          location: {
            start: {
              offset: 45,
              line: 2,
              column: 16,
            },
            end: {
              offset: 48,
              line: 2,
              column: 19,
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
              offset: 50,
              line: 2,
              column: 21,
            },
            end: {
              offset: 53,
              line: 2,
              column: 24,
            },
          },
        },
      ],
      attributes: [],
      location: {
        start: {
          offset: 30,
          line: 2,
          column: 1,
        },
        end: {
          offset: 54,
          line: 2,
          column: 25,
        },
      },
    },
  ],
  aggregations: [],
};

/*
relation dances(Human: [dancer, partner])
relation Races(Car, Motorcycle){}
*/
const correctER: ER = {
  entities: [],
  relationships: [
    {
      type: "relationship",
      name: "dances",
      participantEntities: [
        {
          entityName: "Human",
          isComposite: true,
          childParticipants: [
            {
              entityName: "dancer",
              isComposite: false,
              cardinality: "N",
              participation: "partial",
              location: {
                start: {
                  offset: 24,
                  line: 1,
                  column: 25,
                },
                end: {
                  offset: 30,
                  line: 1,
                  column: 31,
                },
              },
            },
            {
              entityName: "partner",
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
                  offset: 39,
                  line: 1,
                  column: 40,
                },
              },
            },
          ],
          location: {
            start: {
              offset: 16,
              line: 1,
              column: 17,
            },
            end: {
              offset: 40,
              line: 1,
              column: 41,
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
          offset: 41,
          line: 1,
          column: 42,
        },
      },
    },
    {
      type: "relationship",
      name: "Races",
      participantEntities: [
        {
          entityName: "Car",
          isComposite: false,
          cardinality: "N",
          participation: "partial",
          location: {
            start: {
              offset: 57,
              line: 2,
              column: 16,
            },
            end: {
              offset: 60,
              line: 2,
              column: 19,
            },
          },
        },
        {
          entityName: "Motorcycle",
          isComposite: false,
          cardinality: "N",
          participation: "partial",
          location: {
            start: {
              offset: 62,
              line: 2,
              column: 21,
            },
            end: {
              offset: 72,
              line: 2,
              column: 31,
            },
          },
        },
      ],
      attributes: [],
      location: {
        start: {
          offset: 42,
          line: 2,
          column: 1,
        },
        end: {
          offset: 75,
          line: 2,
          column: 34,
        },
      },
    },
  ],
  aggregations: [],
};

/*
relation dances(Human: [dancer, dancer])
*/
const duplicateRoleER: ER = {
  entities: [],
  relationships: [
    {
      type: "relationship",
      name: "dances",
      participantEntities: [
        {
          entityName: "Human",
          isComposite: true,
          childParticipants: [
            {
              entityName: "dancer",
              isComposite: false,
              cardinality: "N",
              participation: "partial",
              location: {
                start: {
                  offset: 24,
                  line: 1,
                  column: 25,
                },
                end: {
                  offset: 30,
                  line: 1,
                  column: 31,
                },
              },
            },
            {
              entityName: "dancer",
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
              offset: 16,
              line: 1,
              column: 17,
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
  aggregations: [],
};
