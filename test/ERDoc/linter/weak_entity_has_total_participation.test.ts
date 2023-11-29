import { ER } from "../../../src/ERDoc/types/parser/ER";
import { checkWeakEntityHasTotalParticipation } from "../../../src/ERDoc/linter/entity/checkWeakEntityHasTotalParticipation";
import { parse } from "../../../src/ERDoc/parser";

describe("Linter detects that a weak entity must have total participation in its identifying relationship", () => {
  it("Returns an error when a weak entity doesn't have total participation (implicit cardinality)", () => {
    const errors = checkWeakEntityHasTotalParticipation(implicitWrongER);
    expect(errors.length).toBe(1);
    expect(errors[0].type).toBe("WEAK_ENTITY_NOT_TOTAL_PARTICIPATION");
    expect(errors[0].entityName).toBe("Sun");
    expect(errors[0].relationshipName).toBe("BelongsTo");
    expect(errors[0].location).toEqual({
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
    });
  });

  it("Returns an error when a weak entity doesn't have total participation (explicit cardinality)", () => {
    const errors = checkWeakEntityHasTotalParticipation(explicitWrongER);
    expect(errors.length).toBe(1);
    expect(errors[0].type).toBe("WEAK_ENTITY_NOT_TOTAL_PARTICIPATION");
    expect(errors[0].entityName).toBe("Sun");
    expect(errors[0].relationshipName).toBe("BelongsTo");
  });

  it("Returns 2 errors when 2 Weak Entities don't have total participation in the same relationship", () => {
    const errors = checkWeakEntityHasTotalParticipation(
      twoWrongsIn1Relationship,
    );
    expect(errors.length).toBe(2);
    expect(errors.some((e) => e.entityName === "Sun")).toBe(true);
    expect(errors.some((e) => e.entityName === "Earth")).toBe(true);
  });

  it("Returns an error when a weak entity is composite and doesn't have total participation", () => {
    const errors = checkWeakEntityHasTotalParticipation(compositeWrongER);
    expect(errors.length).toBe(1);
    expect(errors[0].type).toBe("WEAK_ENTITY_NOT_TOTAL_PARTICIPATION");
    expect(errors[0].entityName).toBe("Sun");
  });

  it("Doesn't return error when a weak entity has total participation or relationship not present", () => {
    for (const er of noErrorsERs) {
      expect(checkWeakEntityHasTotalParticipation(er).length).toBe(0);
    }
  });
});

const implicitWrongER: ER = parse(`entity Sun depends on BelongsTo {
    id pkey
    temperature
}

relation BelongsTo(Earth, Sun)`);

const explicitWrongER: ER = parse(
  `entity Sun depends on BelongsTo {
    id pkey
    temperature
}

relation BelongsTo(Earth, Sun N)`,
);

const compositeWrongER: ER = parse(`entity Sun depends on BelongsTo {
    id pkey
    temperature
}

relation BelongsTo(Earth, Sun: [SmallSun, BiggerSun])`);

const twoWrongsIn1Relationship: ER = parse(`entity Sun depends on BelongsTo {
    id pkey
    temperature
}

entity Earth depends on BelongsTo {
  id pkey
  population
}

relation BelongsTo(Earth, Sun)`);

const noErrorsERs: ER[] = [
  parse(`
entity Sun depends on BelongsTo {
    id pkey
    temperature
}

relation BelongsTo(Earth, Sun: [SmallSun 1, BiggerSun N!])
  `),

  parse(`
entity Sun depends on BelongsTo {
    id pkey
    temperature
}

relation BelongsTo(Earth, Sun N!)
  `),

  parse(`
entity Sun depends on BelongsTo {
    id pkey
    temperature
}
relation BelongsTo(Earth, Sun 1!)
  `),

  parse(`
entity Sun depends on BelongsTo {
    id pkey
    temperature
}
  `),

  parse(`
  entity Sun {
    id key
    temperature
  }

  relation BelongsTo(Earth, Europe)
`),
];
