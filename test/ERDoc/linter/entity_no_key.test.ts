import { checkEntityNoKey } from "../../../src/ERDoc/linter/entity/checkEntityNoKey";
import { parse } from "../../../src/ERDoc/parser";
import { ER } from "../../../src/ERDoc/types/parser/ER";

describe("Linter detects entities without a primary key", () => {
  it("Detects an entity without a primary key", () => {
    const er: ER = EREntityNoPrimaryKey;
    const errors = checkEntityNoKey(er);
    expect(errors.length).toBe(1);
    expect(errors[0].type).toBe("ENTITY_HAS_NO_KEY");
    expect(errors[0].entityName).toBe("keyboard");
    expect(errors[0].location).toEqual({
      start: {
        offset: 0,
        line: 1,
        column: 1,
      },
      end: {
        offset: 15,
        line: 1,
        column: 16,
      },
    });
  });

  it("Finds no errors when there is a primary key", () => {
    const er: ER = ERWithPrimaryKey;
    const errors = checkEntityNoKey(er);
    expect(errors.length).toBe(0);
  });

  it("Finds more than one error when there's more than 1 wrong entity", () => {
    const er: ER = ERWith2WrongEntities;
    const errors = checkEntityNoKey(er);
    expect(errors.length).toBe(2);
  });

  it("Finds no error when a subclass has no primary key but its parent does", () => {
    const er: ER = ERWithCorrectChildEntity;
    const errors = checkEntityNoKey(er);
    expect(errors.length).toBe(0);
  });

  it("Finds 2 errors when a subclass has no primary key and its parent doesn't", () => {
    const er: ER = ERWithWrongChildEntity;
    const errors = checkEntityNoKey(er);
    expect(errors.length).toBe(2);
  });

  it("Finds errors when a subsubclass and its parents have no primary key", () => {
    const er: ER = ERWrongSubsubclass;
    const errors = checkEntityNoKey(er);
    expect(errors.length).toBe(3);
  });

  it("Finds no errors when the root parent has a primary key", () => {
    const er: ER = ERCorrectSubSubclass;
    const errors = checkEntityNoKey(er);
    expect(errors.length).toBe(0);
  });

  it("Finds no error for a weak entity", () => {
    const errors = checkEntityNoKey(WeakEntityER);
    expect(errors.length).toBe(0);
  });
});

const EREntityNoPrimaryKey: ER = parse(`entity keyboard {
	model
    brand
    switchType
}`);

const ERWithPrimaryKey: ER = parse(`entity keyboard {
	model key
    brand key
    switchType
}`);

const ERWith2WrongEntities: ER = parse(`entity keyboard {
	model
    brand
    switchType
}
entity mouse{
    model
    brand
    dpi
}`);

const ERWithCorrectChildEntity: ER = parse(`entity Vehicle {
  id key
  Brand
  License_plate_number}

entity Car extends Vehicle {
    Max_speed
    Brand
    N_passengers
}`);

const ERWithWrongChildEntity: ER = parse(`entity Vehicle {
  Brand
  License_plate_number}

entity Car extends Vehicle {
    Max_speed
    Brand
    N_passengers
}`);

const ERWrongSubsubclass: ER = parse(`entity Vehicle {
  Brand
  License_plate_number}

entity Car extends Vehicle {
    Max_speed
    Brand
    N_passengers
}

entity ElectricCar extends Car {
    Battery_capacity
}`);

const ERCorrectSubSubclass: ER = parse(`entity Vehicle {
  Brand key
  License_plate_number}

entity Car extends Vehicle {
    Max_speed
    Brand
    N_passengers
}

entity ElectricCar extends Car {
    Battery_capacity
}`);

const WeakEntityER: ER = parse(`entity keyboard depends on Types {
	  model
    brand
    switchType
}`);
