import { ER } from "../../../src/ERDoc/types/parser/ER";
import { checkWeakEntityRelationshipExists } from "../../../src/ERDoc/linter/entity/checkWeakEntityRelationshipExists";
import { parse } from "../../../src/ERDoc/parser";

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

const missingRelationshipER: ER = parse(`entity Car depends on Drives {
    Max_speed pkey
    Brand
    N_passengers
}

relation Makes(Car, Company)`);

const correctER: ER = parse(`entity Car depends on Drives {
    Max_speed pkey
    Brand
    N_passengers
}

relation Drives(Car, Human) {
    traveled_kms
}`);
