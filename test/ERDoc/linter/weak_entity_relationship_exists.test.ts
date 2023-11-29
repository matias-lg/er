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
        offset: 10,
        line: 1,
        column: 11,
      },
    });
  });

  it("Detects no errors when relationship is present", () => {
    const errors = checkWeakEntityRelationshipExists(correctER);
    expect(errors.length).toBe(0);
  });

  it("Detects multiple errors when multiple dependencies are missing", () => {
    const errors = checkWeakEntityRelationshipExists(missing2Deps);
    expect(errors.length).toBe(2);
  });

  it("Detects 1 error when 1 out of 3 dependencies is missing", () => {
    const errors = checkWeakEntityRelationshipExists(missing1Dep);
    expect(errors.length).toBe(1);
  });
});

const missingRelationshipER: ER = parse(`entity Car depends on Drives {
    Max_speed pkey
    Brand
    N_passengers
}

relation Makes(Car, Company)`);

const missing2Deps = parse(`
  entity Dog depends on Feeds, PlaysWith {
    id pkey
  }
`);

const missing1Dep = parse(`
  entity Dog depends on Feeds, PlaysWith, Chases {
    id pkey
  }

  relation Feeds(Dog, Human)
  relation PlaysWith(Dog, Human)
`);

const correctER: ER = parse(`entity Car depends on Drives {
    Max_speed pkey
    Brand
    N_passengers
}

relation Drives(Car, Human) {
    traveled_kms
}`);
