import { checkEntityExtendsChildEntity } from "../../../src/ERDoc/linter/entity/checkEntityExtendsChild";
import { parse } from "../../../src/ERDoc/parser";
import { ER } from "../../../src/ERDoc/types/parser/ER";

describe("Linter detects when a child entity extends a child entity", () => {
  it("should return an error when an entity extends a child entity", () => {
    const errors = checkEntityExtendsChildEntity(wrongER);
    expect(errors.length).toBe(1);
    expect(errors[0].type).toBe("ENTITY_EXTENDS_CHILD_ENTITY");
    expect(errors[0].parentEntityName).toBe("Animal");
    expect(errors[0].childEntityName).toBe("Dog");
  });

  it("should return 1 error when an entity extends a child from multiple levels of inheritance", () => {
    const errors = checkEntityExtendsChildEntity(wrongERmultipleInheritance);
    expect(errors.length).toBe(1);
    expect(errors[0].type).toBe("ENTITY_EXTENDS_CHILD_ENTITY");
  });

  it("should return an empty array when no entity extends a child entity", () => {
    const errors = checkEntityExtendsChildEntity(correctER);
    expect(errors.length).toBe(0);
  });

  it("shouldn't hang when there is a cyclic dependency", () => {
    const errors = checkEntityExtendsChildEntity(cyclicER);
    expect(errors.length).toBe(1);
  });
});

const wrongER: ER = parse(`entity Dog extends Animal {
    breed
}

entity Animal extends Dog {
	a_id key
}
`);

const wrongERmultipleInheritance: ER = parse(`entity Dog extends Mammal {
    breed
}

entity Mammal extends Animal {
	hasHair
}

entity Animal extends Life {
	age
}

entity Life extends Dog {
	l_id key
}`);

const cyclicER: ER = parse(`

entity Life extends Westie {
	age
}

entity Mammal extends Life {
	m_id
}

entity Dog extends Mammal {
	name
}

entity Westie extends Dog {

}

entity Frenchie extends Dog {

}`);

const correctER: ER = parse(`entity Dog extends Mammal {
    breed
}

entity Mammal extends Animal {
	hasHair
}

entity Animal extends Life {
	age
}

entity Life {
	l_id key
}`);
