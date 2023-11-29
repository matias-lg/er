import { checkEntityDuplicate } from "../../../src/ERDoc/linter/entity/checkEntityDuplicate";
import { parse } from "../../../src/ERDoc/parser";
import { ER } from "../../../src/ERDoc/types/parser/ER";

describe("Linter detects duplicate entities", () => {
  it("Detects duplicate entities", () => {
    const errors = checkEntityDuplicate(ERWithDuplicateEntities);
    expect(errors).toHaveLength(1);
    expect(errors[0].type).toBe("ENTITY_DUPLICATE");
    expect(errors[0].entityName).toBe("food");
    expect(errors[0].location).toStrictEqual({
      start: {
        offset: 40,
        line: 6,
        column: 1,
      },
      end: {
        offset: 51,
        line: 6,
        column: 12,
      },
    });
  });

  it("Doesn't detect duplicates in 2 different entities", () => {
    const errors = checkEntityDuplicate(correctER);
    expect(errors).toHaveLength(0);
  });

  it("Gives the last position of duplicates", () => {
    const errors = checkEntityDuplicate(ERWith3SameEntities);
    expect(errors).toHaveLength(1);
    expect(errors[0].location).toStrictEqual({
      start: {
        offset: 80,
        line: 11,
        column: 1,
      },
      end: {
        offset: 91,
        line: 11,
        column: 12,
      },
    });
  });

  it("Finds more than one duplicate", () => {
    const errors = checkEntityDuplicate(ERWith3DuplicateEntities);
    expect(errors).toHaveLength(3);
  });
});

const ERWithDuplicateEntities: ER = parse(`entity food {
	name key
    calories
}

entity food {
	name key
    calories
}`);

const correctER: ER = parse(`entity human {
	name key
}

entity dog {
	name key
}`);

const ERWith3SameEntities: ER = parse(`entity food {
	name key
    calories
}

entity food {
	name key
    calories
}

entity food {
	name key
    calories
}`);

const ERWith3DuplicateEntities: ER = parse(`entity food {
	name key
    calories
}

entity cat {
	name key
    hasChip
}

entity food {
	name key
    category
}

entity dog {
	name key
    breed
}

entity dog {
	name key
    breed
}

entity cat {
	name key
    isHungry
}`);
