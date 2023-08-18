import { ER } from "../../../src/ERDoc/types/parser/ER";
import { checkRelationshipLessThanTwoParticipatingEntities } from "../../../src/ERDoc/linter/relationship/checkRelationshipLessThanTwoParticipatingEntities";

describe("Linter detects relationships with less than two participating entities", () => {
  it("Returns error when there's only one partipating entity", () => {
    const errors = checkRelationshipLessThanTwoParticipatingEntities(wrongER);
    expect(errors.length).toBe(1);
    expect(errors[0].type).toBe(
      "RELATIONSHIP_LESS_THAN_TWO_PARTICIPATING_ENTITIES",
    );
    expect(errors[0].relationshipName).toBe("works_for");
    expect(errors[0].location).toEqual({
      start: {
        offset: 0,
        line: 1,
        column: 1,
      },
      end: {
        offset: 32,
        line: 1,
        column: 33,
      },
    });
  });

  it("Returns error when there's only one partipating entity with a single role", () => {
    const errors = checkRelationshipLessThanTwoParticipatingEntities(wrongER2);
    expect(errors.length).toBe(1);
    expect(errors[0].type).toBe(
      "RELATIONSHIP_LESS_THAN_TWO_PARTICIPATING_ENTITIES",
    );
    expect(errors[0].relationshipName).toBe("supervises");
    expect(errors[0].location).toEqual({
      start: {
        offset: 0,
        line: 1,
        column: 1,
      },
      end: {
        offset: 45,
        line: 1,
        column: 46,
      },
    });
  });

  it("Returns 0 errors when there's only one partipating entity with more than 1 role", () => {
    const errors = checkRelationshipLessThanTwoParticipatingEntities(correctER);
    expect(errors.length).toBe(0);
  });

  it("Returns 0 errors when there's more than one partipating entity", () => {
    const errors =
      checkRelationshipLessThanTwoParticipatingEntities(correctER2);
    expect(errors.length).toBe(0);
  });
});

/*
relation works_for(department){}
*/
const wrongER: ER = {
  entities: [],
  relationships: [
    {
      type: "relationship",
      name: "works_for",
      participantEntities: [
        {
          entityName: "department",
          isComposite: false,
          cardinality: "N",
          participation: "partial",
          location: {
            start: {
              offset: 19,
              line: 1,
              column: 20,
            },
            end: {
              offset: 29,
              line: 1,
              column: 30,
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
          offset: 32,
          line: 1,
          column: 33,
        },
      },
    },
  ],
  aggregations: [],
};

/*
relation supervises(employee: [supervisor]){}
*/
const wrongER2: ER = {
  entities: [],
  relationships: [
    {
      type: "relationship",
      name: "supervises",
      participantEntities: [
        {
          entityName: "employee",
          isComposite: true,
          childParticipants: [
            {
              entityName: "supervisor",
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
                  offset: 41,
                  line: 1,
                  column: 42,
                },
              },
            },
          ],
          location: {
            start: {
              offset: 20,
              line: 1,
              column: 21,
            },
            end: {
              offset: 42,
              line: 1,
              column: 43,
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
          offset: 45,
          line: 1,
          column: 46,
        },
      },
    },
  ],
  aggregations: [],
};

/*
relation supervises(employee: [supervisor, supervisee])
*/
const correctER: ER = {
  entities: [],
  relationships: [
    {
      type: "relationship",
      name: "supervises",
      participantEntities: [
        {
          entityName: "employee",
          isComposite: true,
          childParticipants: [
            {
              entityName: "supervisor",
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
                  offset: 41,
                  line: 1,
                  column: 42,
                },
              },
            },
            {
              entityName: "supervisee",
              isComposite: false,
              cardinality: "N",
              participation: "partial",
              location: {
                start: {
                  offset: 43,
                  line: 1,
                  column: 44,
                },
                end: {
                  offset: 53,
                  line: 1,
                  column: 54,
                },
              },
            },
          ],
          location: {
            start: {
              offset: 20,
              line: 1,
              column: 21,
            },
            end: {
              offset: 54,
              line: 1,
              column: 55,
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
          offset: 55,
          line: 1,
          column: 56,
        },
      },
    },
  ],
  aggregations: [],
};

/*
relation supervises(supervisor, supervisee, company)
*/
const correctER2: ER = {
  entities: [],
  relationships: [
    {
      type: "relationship",
      name: "supervises",
      participantEntities: [
        {
          entityName: "supervisor",
          isComposite: false,
          cardinality: "N",
          participation: "partial",
          location: {
            start: {
              offset: 20,
              line: 1,
              column: 21,
            },
            end: {
              offset: 30,
              line: 1,
              column: 31,
            },
          },
        },
        {
          entityName: "supervisee",
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
              offset: 42,
              line: 1,
              column: 43,
            },
          },
        },
        {
          entityName: "company",
          isComposite: false,
          cardinality: "N",
          participation: "partial",
          location: {
            start: {
              offset: 44,
              line: 1,
              column: 45,
            },
            end: {
              offset: 51,
              line: 1,
              column: 52,
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
          offset: 52,
          line: 1,
          column: 53,
        },
      },
    },
  ],
  aggregations: [],
};
