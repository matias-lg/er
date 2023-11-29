import { ER } from "../../../src/ERDoc/types/parser/ER";
import { checkRelationshipLessThanTwoParticipatingEntities } from "../../../src/ERDoc/linter/relationship/checkRelationshipLessThanTwoParticipatingEntities";
import { parse } from "../../../src/ERDoc/parser";

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
        offset: 18,
        line: 1,
        column: 19,
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
        offset: 19,
        line: 1,
        column: 20,
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

const wrongER: ER = parse(`relation works_for(department){}`);

const wrongER2: ER = parse(`relation supervises(employee: [supervisor]){}`);

const correctER: ER = parse(
  `relation supervises(employee: [supervisor, supervisee])`,
);

const correctER2: ER = parse(
  `relation supervises(supervisor, supervisee, company)`,
);
