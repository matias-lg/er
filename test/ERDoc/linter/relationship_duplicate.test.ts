import { ER } from "../../../src/ERDoc/types/parser/ER";
import { checkRelationshipDuplicate } from "../../../src/ERDoc/linter/relationship/checkRelationshipDuplicate";
import { parse } from "../../../src/ERDoc/parser";

describe("Linter checks for duplicate relationships", () => {
  it("detects two duplicate relationships", () => {
    const er: ER = duplicateRelationshipER;
    const errors = checkRelationshipDuplicate(er);
    expect(errors.length).toBe(1);
    expect(errors[0].type).toBe("RELATIONSHIP_DUPLICATE");
    expect(errors[0].relationshipName).toBe("Owns");
    expect(errors[0].location).toEqual({
      start: {
        offset: 28,
        line: 2,
        column: 1,
      },
      end: {
        offset: 41,
        line: 2,
        column: 14,
      },
    });
  });

  it("detects duplicate relationship with a multivalued participant", () => {
    const er: ER = duplicateRelationshipMultivalER;
    const errors = checkRelationshipDuplicate(er);
    expect(errors.length).toBe(1);
    expect(errors[0].type).toBe("RELATIONSHIP_DUPLICATE");
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

const duplicateRelationshipER: ER = parse(`relation Owns(Human, House)
relation Owns(Human, House)`);

const duplicateRelationshipMultivalER: ER = parse(`relation Owns(Human, House)
relation Owns(Human, House: [SingleFloorHouse, WoodenFloorHouse])`);

const sameNameDIfferentParticipantER: ER = parse(`relation Owns(Human, House)
relation Owns(Human, Car)`);

const differentRelationshipsER: ER = parse(`relation Owns(Human, House)
relation DancesTo(Human, Music)`);
