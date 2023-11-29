import { checkEntityExtendsNonExistentEntity } from "../../../src/ERDoc/linter/entity/checkExtendsExistingEntity";
import { parse } from "../../../src/ERDoc/parser";
import { ER } from "../../../src/ERDoc/types/parser/ER";

describe("Linter detects entity extending non-existent entity", () => {
  it("detects entity extending non-existent entity", () => {
    const errors = checkEntityExtendsNonExistentEntity(missingParentER);
    expect(errors).toHaveLength(1);
    expect(errors[0].type).toBe("ENTITY_EXTENDS_NON_EXISTENT_ENTITY");
    expect(errors[0].entityName).toBe("Dog");
    expect(errors[0].extendsEntityName).toBe("Animal");
    expect(errors[0].location).toStrictEqual({
      start: {
        offset: 46,
        line: 6,
        column: 1,
      },
      end: {
        offset: 56,
        line: 6,
        column: 11,
      },
    });
  });

  it("Doesn't return an error in a correct ER", () => {
    const errors = checkEntityExtendsNonExistentEntity(correctER);
    expect(errors).toHaveLength(0);
  });
});

const missingParentER: ER = parse(`entity Instrument {
    name key
    price
}

entity Dog extends Animal {
  daily_walks
	Breed
}`);

const correctER: ER = parse(
  `entity Animal {
    name key
    age
}

entity Dog extends Animal {
  daily_walks
	Breed
}`,
);
