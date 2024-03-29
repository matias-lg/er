import { ER } from "../../../src/ERDoc/types/parser/ER";
import { checkWeakEntityInRelationship } from "../../../src/ERDoc/linter/entity/checkWeakEntityInRelationship";
import { parse } from "../../../src/ERDoc/parser";

describe("Linter detects that a weak entity must participate in its identifying relationship", () => {
  it("Finds an error when a weak entity doesn't participate in its identifying relationship", () => {
    const errors = checkWeakEntityInRelationship(missingWeakEntER);
    expect(errors.length).toBe(1);
    expect(errors[0].entityName).toBe("Sun");
    expect(errors[0].relationshipName).toBe("BelongsTo");
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

  it("Finds no error when the relationship is missing", () => {
    const errors = checkWeakEntityInRelationship(missingRelationshipER);
    expect(errors.length).toBe(0);
  });

  it("Finds no error in a correct ER", () => {
    const errors = checkWeakEntityInRelationship(correctER);
    expect(errors.length).toBe(0);
  });

  it("Finds multiple errors when multiple dependencies are missing", () => {
    const errors = checkWeakEntityInRelationship(
      missingInMultipleRelationshipER,
    );
    expect(errors.length).toBe(3);
  });

  it("Finds 2 errors when 2 out of 3 dependencies is missing", () => {
    const errors = checkWeakEntityInRelationship(twoMissingER);
    expect(errors.length).toBe(2);
  });
});

const missingWeakEntER: ER = parse(`entity Sun depends on BelongsTo {
    id pkey
    temperature
}

relation BelongsTo(Earth)`);

const missingRelationshipER: ER = parse(`entity Sun depends on BelongsTo {
    id pkey
    temperature
}`);

const correctER: ER = parse(`entity Sun depends on BelongsTo {
    id pkey
    temperature
}

relation BelongsTo(Earth, Sun)`);

const missingInMultipleRelationshipER: ER =
  parse(`entity Sun depends on BelongsTo, Has, StudiedBy {
    id pkey
    temperature
}

relation BelongsTo(Earth, MilkyWay)
relation Has(Earth, MilkyWay)
relation StudiedBy(Earth, Scientist)
`);

const twoMissingER: ER =
  parse(`entity Sun depends on BelongsTo, Has, StudiedBy {
    id pkey
    temperature
}

relation BelongsTo(Earth, Sun)
relation Has(Earth, MilkyWay)
relation StudiedBy(Earth, Scientist)
`);
