import { checkEntityExtendsNonExistentEntity } from "../../src/linter/entity/checkExtendsExistingEntity";
import { ER } from "../../src/types/parser/ER";

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
        offset: 96,
        line: 9,
        column: 2,
      },
    });
  });

  it("Doesn't return an error in a correct ER", () => {
    const errors = checkEntityExtendsNonExistentEntity(correctER);
    expect(errors).toHaveLength(0);
  });
});

/*
entity Instrument {
    name key
    price
}

entity Dog extends Animal {
  daily_walks
	Breed
}
*/
const missingParentER: ER = {
  entities: [
    {
      type: "entity",
      name: "Instrument",
      attributes: [
        {
          name: "name",
          location: {
            start: {
              offset: 24,
              line: 2,
              column: 5,
            },
            end: {
              offset: 32,
              line: 2,
              column: 13,
            },
          },
          isKey: true,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "price",
          location: {
            start: {
              offset: 37,
              line: 3,
              column: 5,
            },
            end: {
              offset: 42,
              line: 3,
              column: 10,
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
          offset: 44,
          line: 4,
          column: 2,
        },
      },
    },
    {
      type: "entity",
      name: "Dog",
      attributes: [
        {
          name: "daily_walks",
          location: {
            start: {
              offset: 76,
              line: 7,
              column: 3,
            },
            end: {
              offset: 87,
              line: 7,
              column: 14,
            },
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "Breed",
          location: {
            start: {
              offset: 89,
              line: 8,
              column: 2,
            },
            end: {
              offset: 94,
              line: 8,
              column: 7,
            },
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null,
        },
      ],
      hasParent: true,
      parentName: "Animal",
      hasDependencies: false,
      dependsOn: null,
      location: {
        start: {
          offset: 46,
          line: 6,
          column: 1,
        },
        end: {
          offset: 96,
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
entity Animal {
    name key
    age
}

entity Dog extends Animal {
  daily_walks
	Breed
}
*/
const correctER: ER = {
  entities: [
    {
      type: "entity",
      name: "Animal",
      attributes: [
        {
          name: "name",
          location: {
            start: {
              offset: 20,
              line: 2,
              column: 5,
            },
            end: {
              offset: 28,
              line: 2,
              column: 13,
            },
          },
          isKey: true,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "age",
          location: {
            start: {
              offset: 33,
              line: 3,
              column: 5,
            },
            end: {
              offset: 36,
              line: 3,
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
          offset: 0,
          line: 1,
          column: 1,
        },
        end: {
          offset: 38,
          line: 4,
          column: 2,
        },
      },
    },
    {
      type: "entity",
      name: "Dog",
      attributes: [
        {
          name: "daily_walks",
          location: {
            start: {
              offset: 70,
              line: 7,
              column: 3,
            },
            end: {
              offset: 81,
              line: 7,
              column: 14,
            },
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "Breed",
          location: {
            start: {
              offset: 83,
              line: 8,
              column: 2,
            },
            end: {
              offset: 88,
              line: 8,
              column: 7,
            },
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null,
        },
      ],
      hasParent: true,
      parentName: "Animal",
      hasDependencies: false,
      dependsOn: null,
      location: {
        start: {
          offset: 40,
          line: 6,
          column: 1,
        },
        end: {
          offset: 90,
          line: 9,
          column: 2,
        },
      },
    },
  ],
  relationships: [],
  aggregations: [],
};
