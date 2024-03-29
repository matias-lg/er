import { ER } from "../../../src/ERDoc/types/parser/ER";
import { checkWeakEntityConstraints } from "../../../src/ERDoc/linter/entity/checkWeakEntityHasTotalParticipation";
import { parse } from "../../../src/ERDoc/parser";

describe("Linter detects that a weak entity must have total participation in its identifying relationship", () => {
  it("Returns an error when a weak entity doesn't have total participation (implicit cardinality)", () => {
    const errors = checkWeakEntityConstraints(implicitWrongER);
    expect(errors.length).toBe(1);
    expect(errors[0].type).toBe("WEAK_ENTITY_WRONG_CONSTRAINTS");
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
    const errors = checkWeakEntityConstraints(explicitWrongER);
    expect(errors.length).toBe(1);
    expect(errors[0].type).toBe("WEAK_ENTITY_WRONG_CONSTRAINTS");
    expect(errors[0].entityName).toBe("Sun");
    expect(errors[0].relationshipName).toBe("BelongsTo");
  });

  it("Returns 2 errors when 2 Weak Entities don't have total participation in the same relationship", () => {
    const errors = checkWeakEntityConstraints(twoWrongsIn1Relationship);
    expect(errors.length).toBe(2);
    expect(errors.some((e) => e.entityName === "Sun")).toBe(true);
    expect(errors.some((e) => e.entityName === "Earth")).toBe(true);
  });

  it("Returns an error when a weak entity is composite and doesn't have total participation", () => {
    const errors = checkWeakEntityConstraints(compositeWrongER);
    expect(errors.length).toBe(1);
    expect(errors[0].type).toBe("WEAK_ENTITY_WRONG_CONSTRAINTS");
    expect(errors[0].entityName).toBe("Sun");
  });

  it("Doesn't return error when a weak entity has total participation and cardinality of 1, or relationship not present", () => {
    for (const er of noErrorsERs) {
      expect(checkWeakEntityConstraints(er).length).toBe(0);
    }
  });

  it("Returns 3 errors when a weak entity doesn't have total participation in 3 dependencies", () => {
    const errors = checkWeakEntityConstraints(wrongIn3Deps);
    expect(errors.length).toBe(3);
  });

  it("Returns 2 errors when a weak entity doesn't have total participation in 2 out of 3 dependencies", () => {
    const errors = checkWeakEntityConstraints(wrongIn2Deps);
    expect(errors.length).toBe(2);
  });

  it("Returns 1 error when a weak entity has cardinality of 1, but not total participation", () => {
    const errors = checkWeakEntityConstraints(onlyCardinalityOneER);
    expect(errors.length).toBe(1);
  });

  it("Returns 1 errors when a weak entity has total participation, but not a cardinality of 1", () => {
    const errors = checkWeakEntityConstraints(onlyTotalParticipationER);
    expect(errors.length).toBe(1);
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

const onlyTotalParticipationER: ER = parse(
  `entity Sun depends on BelongsTo {
    id pkey
    temperature
}

relation BelongsTo(Earth, Sun N!)`,
);

const onlyCardinalityOneER: ER = parse(
  `entity Sun depends on BelongsTo {
    id pkey
    temperature
}

relation BelongsTo(Earth, Sun 1)`,
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

const wrongIn3Deps = parse(`
  entity Pizza depends on Prepares, Delivers, Has {
    brand pkey
  }

  relation Prepares(Chef, Pizza)
  relation Delivers(DeliveryDriver, Pizza)
  relation Has(Pizzeria, Pizza)
`);

const wrongIn2Deps = parse(`
  entity Pizza depends on Prepares, Delivers, Has {
    brand pkey
  }

  relation Prepares(Chef, Pizza)
  relation Delivers(DeliveryDriver, Pizza 1!)
  relation Has(Pizzeria, Pizza)
  `);

const noErrorsERs: ER[] = [
  parse(`
entity Sun depends on BelongsTo {
    id pkey
    temperature
}

relation BelongsTo(Earth, Sun: [SmallSun 1!, BiggerSun 1!])
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
