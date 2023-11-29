import { ER } from "../../../src/ERDoc/types/parser/ER";
import { checkRelationshipDuplicateParticipant } from "../../../src/ERDoc/linter/relationship/checkRelationshipDuplicateParticipant";
import { parse } from "../../../src/ERDoc/parser";

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

const wrongER: ER = parse(`relation dances(Human, Human)`);

const wrongER2: ER = parse(`relation dances(Human, Human: [dancer, partner])`);

const MultiWrongER: ER = parse(`relation dances(Human, Human)
relation Races(Car, Car)`);

const correctER: ER = parse(`relation dances(Human: [dancer, partner])
relation Races(Car, Motorcycle){}`);

const duplicateRoleER: ER = parse(`relation dances(Human: [dancer, dancer])`);
