import { checkEntityNoKey } from "../../src/linter/entity/checkEntityNoKey";
import { ER } from "../../src/types/parser/ER";

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
        offset: 51,
        line: 5,
        column: 2,
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

/*
entity keyboard {
	model
    brand
    switchType
}
*/
const EREntityNoPrimaryKey: ER = {
  entities: [
    {
      type: "entity",
      name: "keyboard",
      attributes: [
        {
          name: "model",
          location: {
            start: {
              offset: 19,
              line: 2,
              column: 2,
            },
            end: {
              offset: 24,
              line: 2,
              column: 7,
            },
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "brand",
          location: {
            start: {
              offset: 29,
              line: 3,
              column: 5,
            },
            end: {
              offset: 34,
              line: 3,
              column: 10,
            },
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "switchType",
          location: {
            start: {
              offset: 39,
              line: 4,
              column: 5,
            },
            end: {
              offset: 49,
              line: 4,
              column: 15,
            },
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null,
        },
      ],
      hasParent: false,
      parentName: null,
      hasDependencies: false,
      dependsOn: null,
      location: {
        start: {
          offset: 0,
          line: 1,
          column: 1,
        },
        end: {
          offset: 51,
          line: 5,
          column: 2,
        },
      },
    },
  ],
  relationships: [],
  aggregations: [],
};

/*
entity keyboard {
	model key
    brand key
    switchType
}
*/
const ERWithPrimaryKey: ER = {
  entities: [
    {
      type: "entity",
      name: "keyboard",
      attributes: [
        {
          name: "model",
          location: {
            start: {
              offset: 19,
              line: 2,
              column: 2,
            },
            end: {
              offset: 28,
              line: 2,
              column: 11,
            },
          },
          isKey: true,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "brand",
          location: {
            start: {
              offset: 33,
              line: 3,
              column: 5,
            },
            end: {
              offset: 42,
              line: 3,
              column: 14,
            },
          },
          isKey: true,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "switchType",
          location: {
            start: {
              offset: 47,
              line: 4,
              column: 5,
            },
            end: {
              offset: 57,
              line: 4,
              column: 15,
            },
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null,
        },
      ],
      hasParent: false,
      parentName: null,
      hasDependencies: false,
      dependsOn: null,
      location: {
        start: {
          offset: 0,
          line: 1,
          column: 1,
        },
        end: {
          offset: 59,
          line: 5,
          column: 2,
        },
      },
    },
  ],
  relationships: [],
  aggregations: [],
};

/*
entity keyboard {
	model
    brand
    switchType
}
entity mouse{
    model
    brand
    dpi
}
*/
const ERWith2WrongEntities: ER = {
  entities: [
    {
      type: "entity",
      name: "keyboard",
      attributes: [
        {
          name: "model",
          location: {
            start: {
              offset: 19,
              line: 2,
              column: 2,
            },
            end: {
              offset: 24,
              line: 2,
              column: 7,
            },
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "brand",
          location: {
            start: {
              offset: 29,
              line: 3,
              column: 5,
            },
            end: {
              offset: 34,
              line: 3,
              column: 10,
            },
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "switchType",
          location: {
            start: {
              offset: 39,
              line: 4,
              column: 5,
            },
            end: {
              offset: 49,
              line: 4,
              column: 15,
            },
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null,
        },
      ],
      hasParent: false,
      parentName: null,
      hasDependencies: false,
      dependsOn: null,
      location: {
        start: {
          offset: 0,
          line: 1,
          column: 1,
        },
        end: {
          offset: 51,
          line: 5,
          column: 2,
        },
      },
    },
    {
      type: "entity",
      name: "mouse",
      attributes: [
        {
          name: "model",
          location: {
            start: {
              offset: 70,
              line: 7,
              column: 5,
            },
            end: {
              offset: 75,
              line: 7,
              column: 10,
            },
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "brand",
          location: {
            start: {
              offset: 80,
              line: 8,
              column: 5,
            },
            end: {
              offset: 85,
              line: 8,
              column: 10,
            },
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "dpi",
          location: {
            start: {
              offset: 90,
              line: 9,
              column: 5,
            },
            end: {
              offset: 93,
              line: 9,
              column: 8,
            },
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null,
        },
      ],
      hasParent: false,
      parentName: null,
      hasDependencies: false,
      dependsOn: null,
      location: {
        start: {
          offset: 52,
          line: 6,
          column: 1,
        },
        end: {
          offset: 95,
          line: 10,
          column: 2,
        },
      },
    },
  ],
  relationships: [],
  aggregations: [],
};

/*
entity Vehicle {
  id key
  Brand
  License_plate_number}

entity Car extends Vehicle {
    Max_speed
    Brand
    N_passengers
}
*/
const ERWithCorrectChildEntity: ER = {
  entities: [
    {
      type: "entity",
      name: "Vehicle",
      attributes: [
        {
          name: "id",
          location: {
            start: {
              offset: 19,
              line: 2,
              column: 3,
            },
            end: {
              offset: 25,
              line: 2,
              column: 9,
            },
          },
          isKey: true,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "Brand",
          location: {
            start: {
              offset: 28,
              line: 3,
              column: 3,
            },
            end: {
              offset: 33,
              line: 3,
              column: 8,
            },
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "License_plate_number",
          location: {
            start: {
              offset: 36,
              line: 4,
              column: 3,
            },
            end: {
              offset: 56,
              line: 4,
              column: 23,
            },
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null,
        },
      ],
      hasParent: false,
      parentName: null,
      hasDependencies: false,
      dependsOn: null,
      location: {
        start: {
          offset: 0,
          line: 1,
          column: 1,
        },
        end: {
          offset: 57,
          line: 4,
          column: 24,
        },
      },
    },
    {
      type: "entity",
      name: "Car",
      attributes: [
        {
          name: "Max_speed",
          location: {
            start: {
              offset: 92,
              line: 7,
              column: 5,
            },
            end: {
              offset: 101,
              line: 7,
              column: 14,
            },
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "Brand",
          location: {
            start: {
              offset: 106,
              line: 8,
              column: 5,
            },
            end: {
              offset: 111,
              line: 8,
              column: 10,
            },
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "N_passengers",
          location: {
            start: {
              offset: 116,
              line: 9,
              column: 5,
            },
            end: {
              offset: 128,
              line: 9,
              column: 17,
            },
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null,
        },
      ],
      hasParent: true,
      parentName: "Vehicle",
      hasDependencies: false,
      dependsOn: null,
      location: {
        start: {
          offset: 59,
          line: 6,
          column: 1,
        },
        end: {
          offset: 130,
          line: 10,
          column: 2,
        },
      },
    },
  ],
  relationships: [],
  aggregations: [],
};

/*
entity Vehicle {
  Brand
  License_plate_number}

entity Car extends Vehicle {
    Max_speed
    Brand
    N_passengers
}
*/
const ERWithWrongChildEntity: ER = {
  entities: [
    {
      type: "entity",
      name: "Vehicle",
      attributes: [
        {
          name: "Brand",
          location: {
            start: {
              offset: 19,
              line: 2,
              column: 3,
            },
            end: {
              offset: 24,
              line: 2,
              column: 8,
            },
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "License_plate_number",
          location: {
            start: {
              offset: 27,
              line: 3,
              column: 3,
            },
            end: {
              offset: 47,
              line: 3,
              column: 23,
            },
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null,
        },
      ],
      hasParent: false,
      parentName: null,
      hasDependencies: false,
      dependsOn: null,
      location: {
        start: {
          offset: 0,
          line: 1,
          column: 1,
        },
        end: {
          offset: 48,
          line: 3,
          column: 24,
        },
      },
    },
    {
      type: "entity",
      name: "Car",
      attributes: [
        {
          name: "Max_speed",
          location: {
            start: {
              offset: 83,
              line: 6,
              column: 5,
            },
            end: {
              offset: 92,
              line: 6,
              column: 14,
            },
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "Brand",
          location: {
            start: {
              offset: 97,
              line: 7,
              column: 5,
            },
            end: {
              offset: 102,
              line: 7,
              column: 10,
            },
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "N_passengers",
          location: {
            start: {
              offset: 107,
              line: 8,
              column: 5,
            },
            end: {
              offset: 119,
              line: 8,
              column: 17,
            },
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null,
        },
      ],
      hasParent: true,
      parentName: "Vehicle",
      hasDependencies: false,
      dependsOn: null,
      location: {
        start: {
          offset: 50,
          line: 5,
          column: 1,
        },
        end: {
          offset: 121,
          line: 9,
          column: 2,
        },
      },
    },
  ],
  relationships: [],
  aggregations: [],
};

/*
entity Vehicle {
  Brand
  License_plate_number}

entity Car extends Vehicle {
    Max_speed
    Brand
    N_passengers
}

entity ElectricCar extends Car {
    Battery_capacity
}
*/
const ERWrongSubsubclass: ER = {
  entities: [
    {
      type: "entity",
      name: "Vehicle",
      attributes: [
        {
          name: "Brand",
          location: {
            start: {
              offset: 19,
              line: 2,
              column: 3,
            },
            end: {
              offset: 24,
              line: 2,
              column: 8,
            },
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "License_plate_number",
          location: {
            start: {
              offset: 27,
              line: 3,
              column: 3,
            },
            end: {
              offset: 47,
              line: 3,
              column: 23,
            },
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null,
        },
      ],
      hasParent: false,
      parentName: null,
      hasDependencies: false,
      dependsOn: null,
      location: {
        start: {
          offset: 0,
          line: 1,
          column: 1,
        },
        end: {
          offset: 48,
          line: 3,
          column: 24,
        },
      },
    },
    {
      type: "entity",
      name: "Car",
      attributes: [
        {
          name: "Max_speed",
          location: {
            start: {
              offset: 83,
              line: 6,
              column: 5,
            },
            end: {
              offset: 92,
              line: 6,
              column: 14,
            },
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "Brand",
          location: {
            start: {
              offset: 97,
              line: 7,
              column: 5,
            },
            end: {
              offset: 102,
              line: 7,
              column: 10,
            },
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "N_passengers",
          location: {
            start: {
              offset: 107,
              line: 8,
              column: 5,
            },
            end: {
              offset: 119,
              line: 8,
              column: 17,
            },
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null,
        },
      ],
      hasParent: true,
      parentName: "Vehicle",
      hasDependencies: false,
      dependsOn: null,
      location: {
        start: {
          offset: 50,
          line: 5,
          column: 1,
        },
        end: {
          offset: 121,
          line: 9,
          column: 2,
        },
      },
    },
    {
      type: "entity",
      name: "ElectricCar",
      attributes: [
        {
          name: "Battery_capacity",
          location: {
            start: {
              offset: 160,
              line: 12,
              column: 5,
            },
            end: {
              offset: 176,
              line: 12,
              column: 21,
            },
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null,
        },
      ],
      hasParent: true,
      parentName: "Car",
      hasDependencies: false,
      dependsOn: null,
      location: {
        start: {
          offset: 123,
          line: 11,
          column: 1,
        },
        end: {
          offset: 178,
          line: 13,
          column: 2,
        },
      },
    },
  ],
  relationships: [],
  aggregations: [],
};

/*
entity Vehicle {
  Brand key
  License_plate_number}

entity Car extends Vehicle {
    Max_speed
    Brand
    N_passengers
}

entity ElectricCar extends Car {
    Battery_capacity
}
*/
const ERCorrectSubSubclass: ER = {
  entities: [
    {
      type: "entity",
      name: "Vehicle",
      attributes: [
        {
          name: "Brand",
          location: {
            start: {
              offset: 19,
              line: 2,
              column: 3,
            },
            end: {
              offset: 28,
              line: 2,
              column: 12,
            },
          },
          isKey: true,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "License_plate_number",
          location: {
            start: {
              offset: 31,
              line: 3,
              column: 3,
            },
            end: {
              offset: 51,
              line: 3,
              column: 23,
            },
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null,
        },
      ],
      hasParent: false,
      parentName: null,
      hasDependencies: false,
      dependsOn: null,
      location: {
        start: {
          offset: 0,
          line: 1,
          column: 1,
        },
        end: {
          offset: 52,
          line: 3,
          column: 24,
        },
      },
    },
    {
      type: "entity",
      name: "Car",
      attributes: [
        {
          name: "Max_speed",
          location: {
            start: {
              offset: 87,
              line: 6,
              column: 5,
            },
            end: {
              offset: 96,
              line: 6,
              column: 14,
            },
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "Brand",
          location: {
            start: {
              offset: 101,
              line: 7,
              column: 5,
            },
            end: {
              offset: 106,
              line: 7,
              column: 10,
            },
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "N_passengers",
          location: {
            start: {
              offset: 111,
              line: 8,
              column: 5,
            },
            end: {
              offset: 123,
              line: 8,
              column: 17,
            },
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null,
        },
      ],
      hasParent: true,
      parentName: "Vehicle",
      hasDependencies: false,
      dependsOn: null,
      location: {
        start: {
          offset: 54,
          line: 5,
          column: 1,
        },
        end: {
          offset: 125,
          line: 9,
          column: 2,
        },
      },
    },
    {
      type: "entity",
      name: "ElectricCar",
      attributes: [
        {
          name: "Battery_capacity",
          location: {
            start: {
              offset: 164,
              line: 12,
              column: 5,
            },
            end: {
              offset: 180,
              line: 12,
              column: 21,
            },
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null,
        },
      ],
      hasParent: true,
      parentName: "Car",
      hasDependencies: false,
      dependsOn: null,
      location: {
        start: {
          offset: 127,
          line: 11,
          column: 1,
        },
        end: {
          offset: 182,
          line: 13,
          column: 2,
        },
      },
    },
  ],
  relationships: [],
  aggregations: [],
};

/*
entity keyboard depends on Types {
	  model
    brand
    switchType
}
*/
const WeakEntityER: ER = {
  entities: [
    {
      type: "entity",
      name: "keyboard",
      attributes: [
        {
          name: "model",
          location: {
            start: {
              offset: 38,
              line: 2,
              column: 4,
            },
            end: {
              offset: 43,
              line: 2,
              column: 9,
            },
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "brand",
          location: {
            start: {
              offset: 48,
              line: 3,
              column: 5,
            },
            end: {
              offset: 53,
              line: 3,
              column: 10,
            },
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "switchType",
          location: {
            start: {
              offset: 58,
              line: 4,
              column: 5,
            },
            end: {
              offset: 68,
              line: 4,
              column: 15,
            },
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null,
        },
      ],
      hasParent: false,
      parentName: null,
      hasDependencies: true,
      dependsOn: {
        relationshipName: "Types",
      },
      location: {
        start: {
          offset: 0,
          line: 1,
          column: 1,
        },
        end: {
          offset: 70,
          line: 5,
          column: 2,
        },
      },
    },
  ],
  relationships: [],
  aggregations: [],
};
