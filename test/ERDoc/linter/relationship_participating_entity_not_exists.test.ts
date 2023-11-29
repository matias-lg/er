import { ER } from "../../../src/ERDoc/types/parser/ER";
import { parse } from "../../../src/ERDoc/parser";
import { checkRelationshipParticipatingEntityNotExists } from "../../../src/ERDoc/linter/relationship/checkRelationshipParticipatingEntityNotExists";

describe("Linter detects entities that are participating in a relationship but do not exist", () => {
  it("Returns an error when entity doesn't exist", () => {
    const errors = checkRelationshipParticipatingEntityNotExists(wrongER);
    expect(errors.length).toBe(1);
    expect(errors[0].type).toBe("RELATIONSHIP_PARTICIPATING_ENTITY_NOT_EXISTS");
    expect(errors[0].relationshipName).toBe("grinds");
    expect(errors[0].entityName).toBe("coffee");
    expect(errors[0].location).toEqual({
      start: {
        offset: 64,
        line: 6,
        column: 17,
      },
      end: {
        offset: 70,
        line: 6,
        column: 23,
      },
    });
  });

  it("Returns more than one error when multiple entities don't exist", () => {
    const errors = checkRelationshipParticipatingEntityNotExists(wrongER2);
    expect(errors.length).toBe(2);
    expect(errors.some((e) => e.entityName === "coffee")).toBe(true);
    expect(errors.some((e) => e.entityName === "barista")).toBe(true);
  });

  it("Returns no errors when all entities exist", () => {
    const errors = checkRelationshipParticipatingEntityNotExists(correctER);
    expect(errors.length).toBe(0);
  });

  it("Returns no errors when an aggregation exists", () => {
    const errors = checkRelationshipParticipatingEntityNotExists(
      correctERWithAggregation,
    );
    expect(errors.length).toBe(0);
  });
});

const wrongER = parse(`entity grinder {
  model_id key
  brand
  rpm
}
relation grinds(coffee, grinder)`);

const correctER: ER = parse(`entity grinder {
  model_id key
  brand
  rpm
}
entity coffee{
  country_of_origin key
  species key
  roast_date key
  rating
}
relation grinds(coffee, grinder)`);

const correctERWithAggregation: ER = parse(`entity grinder {
  model_id key
  brand
  rpm
}

entity barista {
  RUT key
  name
}

relation uses(barista, grinder)
aggregation barista_uses_grinder(uses)

entity coffee{
  country_of_origin key
  species key
  roast_date key
  rating
}
relation grinds(coffee, barista_uses_grinder)`);

const wrongER2: ER = parse(`entity grinder {
  model_id key
  brand
  rpm
}
relation grinds(coffee, grinder, barista)
`);
