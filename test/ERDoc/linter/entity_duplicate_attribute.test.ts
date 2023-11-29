import { checkEntityDuplicateAttribute } from "../../../src/ERDoc/linter/entity/checkEntityDuplicateAttribute";
import { parse } from "../../../src/ERDoc/parser";
import { ER } from "../../../src/ERDoc/types/parser/ER";

describe("Linter detects duplicate attributes in entities", () => {
  it("detects a duplicate attribute in an entity", () => {
    const errors = checkEntityDuplicateAttribute(ERwithDuplicateAttribute);
    expect(errors).toHaveLength(1);
    expect(errors[0].type).toBe("ENTITY_DUPLICATE_ATTRIBUTE");
    expect(errors[0].entityName).toBe("Song");
    expect(errors[0].attributeName).toBe("author");
    expect(errors[0].location).toEqual({
      start: {
        offset: 42,
        line: 4,
        column: 5,
      },
      end: {
        offset: 48,
        line: 4,
        column: 11,
      },
    });
  });

  it("detects no errors in a correct entity", () => {
    const errors = checkEntityDuplicateAttribute(ERwithCorrectEntity);
    expect(errors).toHaveLength(0);
  });

  it("detects multiple errors in an entity", () => {
    const errors = checkEntityDuplicateAttribute(
      ERWithMultipleDuplicateAttributes,
    );
    expect(errors).toHaveLength(2);
  });

  it("detects errors in 2 different entities", () => {
    const errors = checkEntityDuplicateAttribute(ERWith2WrongEntities);
    expect(errors).toHaveLength(2);
    expect(errors.find((error) => error.entityName === "Song")).toBeDefined();
    expect(errors.find((error) => error.entityName === "Dog")).toBeDefined();
  });

  it("detects error when duplicate is in subclass", () => {
    const errors = checkEntityDuplicateAttribute(ERWithWrongSubclass);
    expect(errors).toHaveLength(1);
    expect(errors[0].type).toBe("ENTITY_DUPLICATE_ATTRIBUTE");
    expect(errors[0].entityName).toBe("Car");
    expect(errors[0].attributeName).toBe("Brand");
  });

  it("detects error when duplicate is in subsubclass", () => {
    const errors = checkEntityDuplicateAttribute(ERWithWrongSubclass2);
    expect(errors).toHaveLength(1);
    expect(errors[0].entityName).toBe("Ferrari");
    expect(errors[0].attributeName).toBe("Brand");
  });

  it("returns when there is a circular inheritance", () => {
    const errors = checkEntityDuplicateAttribute(ERWithCircularInheritance);
    expect(errors).toHaveLength(0);
  });
});

const ERwithDuplicateAttribute: ER = parse(`entity Song {
    name key
    author
    author
}`);

const ERwithCorrectEntity: ER = parse(`entity Song {
    name key
    author
}`);

const ERWithMultipleDuplicateAttributes: ER = parse(`entity Song {
    name key
    name
    author
    author
}`);

const ERWith2WrongEntities: ER = parse(
  `entity Song {
    name key
    author
    author
}

entity Dog {
    name key
    name
}`,
);

const ERWithWrongSubclass: ER = parse(`entity Vehicle {
  id key
  Brand
  License_plate_number}

entity Car extends Vehicle {
    Max_speed
    Brand
    N_passengers
}

entity Truck extends Vehicle {
  Tonnage
  N_of_axles
}`);

const ERWithWrongSubclass2: ER = parse(`entity Vehicle {
  id key
  Brand
  License_plate_number}

entity Car extends Vehicle {
    Max_speed
    N_passengers
}

entity Ferrari extends Car {
  Brand
  Color
}`);

const ERWithCircularInheritance: ER = parse(`entity Dog extends Mammal {
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
