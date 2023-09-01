import { checkEntityExtendsChildEntity } from "../../../src/ERDoc/linter/entity/checkEntityExtendsChild";
import { ER } from "../../../src/ERDoc/types/parser/ER";

describe("Linter detects when a child entity extends a child entity", () => {
  it("should return an error when an entity extends a child entity", () => {
    const errors = checkEntityExtendsChildEntity(wrongER);
    expect(errors.length).toBe(1);
    expect(errors[0].type).toBe("ENTITY_EXTENDS_CHILD_ENTITY");
    expect(errors[0].parentEntityName).toBe("Animal");
    expect(errors[0].childEntityName).toBe("Dog");
  });

  it("should return an error when an entity extends a child from multiple levels of inheritance", () => {
    const errors = checkEntityExtendsChildEntity(wrongERmultipleInheritance);
    expect(errors.length).toBe(1);
    expect(errors[0].type).toBe("ENTITY_EXTENDS_CHILD_ENTITY");
    expect(errors[0].parentEntityName).toBe("Life");
    expect(errors[0].childEntityName).toBe("Dog");
  });

  it("should return an empty array when no entity extends a child entity", () => {
    const errors = checkEntityExtendsChildEntity(correctER);
    expect(errors.length).toBe(0);
  });
});

/*
entity Dog extends Animal {
    breed
}

entity Animal extends Dog {
	a_id key
}
 */
const wrongER: ER = {
  entities: [
    {
      type: "entity",
      name: "Dog",
      attributes: [
        {
          name: "breed",
          location: {
            start: {
              offset: 32,
              line: 2,
              column: 5,
            },
            end: {
              offset: 37,
              line: 2,
              column: 10,
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
          offset: 0,
          line: 1,
          column: 1,
        },
        end: {
          offset: 39,
          line: 3,
          column: 2,
        },
      },
    },
    {
      type: "entity",
      name: "Animal",
      attributes: [
        {
          name: "a_id",
          location: {
            start: {
              offset: 70,
              line: 6,
              column: 2,
            },
            end: {
              offset: 78,
              line: 6,
              column: 10,
            },
          },
          isKey: true,
          isComposite: false,
          childAttributesNames: null,
        },
      ],
      hasParent: true,
      parentName: "Dog",
      hasDependencies: false,
      dependsOn: null,
      location: {
        start: {
          offset: 41,
          line: 5,
          column: 1,
        },
        end: {
          offset: 80,
          line: 7,
          column: 2,
        },
      },
    },
  ],
  relationships: [],
  aggregations: [],
};

/*
entity Dog extends Mammal {
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
}
*/
const wrongERmultipleInheritance: ER = {
  entities: [
    {
      type: "entity",
      name: "Dog",
      attributes: [
        {
          name: "breed",
          location: {
            start: {
              offset: 32,
              line: 2,
              column: 5,
            },
            end: {
              offset: 37,
              line: 2,
              column: 10,
            },
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null,
        },
      ],
      hasParent: true,
      parentName: "Mammal",
      hasDependencies: false,
      dependsOn: null,
      location: {
        start: {
          offset: 0,
          line: 1,
          column: 1,
        },
        end: {
          offset: 39,
          line: 3,
          column: 2,
        },
      },
    },
    {
      type: "entity",
      name: "Mammal",
      attributes: [
        {
          name: "hasHair",
          location: {
            start: {
              offset: 73,
              line: 6,
              column: 2,
            },
            end: {
              offset: 80,
              line: 6,
              column: 9,
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
          offset: 41,
          line: 5,
          column: 1,
        },
        end: {
          offset: 82,
          line: 7,
          column: 2,
        },
      },
    },
    {
      type: "entity",
      name: "Animal",
      attributes: [
        {
          name: "age",
          location: {
            start: {
              offset: 114,
              line: 10,
              column: 2,
            },
            end: {
              offset: 117,
              line: 10,
              column: 5,
            },
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null,
        },
      ],
      hasParent: true,
      parentName: "Life",
      hasDependencies: false,
      dependsOn: null,
      location: {
        start: {
          offset: 84,
          line: 9,
          column: 1,
        },
        end: {
          offset: 119,
          line: 11,
          column: 2,
        },
      },
    },
    {
      type: "entity",
      name: "Life",
      attributes: [
        {
          name: "l_id",
          location: {
            start: {
              offset: 148,
              line: 14,
              column: 2,
            },
            end: {
              offset: 156,
              line: 14,
              column: 10,
            },
          },
          isKey: true,
          isComposite: false,
          childAttributesNames: null,
        },
      ],
      hasParent: true,
      parentName: "Dog",
      hasDependencies: false,
      dependsOn: null,
      location: {
        start: {
          offset: 121,
          line: 13,
          column: 1,
        },
        end: {
          offset: 158,
          line: 15,
          column: 2,
        },
      },
    },
  ],
  relationships: [],
  aggregations: [],
};

/*
entity Dog extends Mammal {
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
}
*/
const correctER: ER = {
  entities: [
    {
      type: "entity",
      name: "Dog",
      attributes: [
        {
          name: "breed",
          location: {
            start: {
              offset: 32,
              line: 2,
              column: 5,
            },
            end: {
              offset: 37,
              line: 2,
              column: 10,
            },
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null,
        },
      ],
      hasParent: true,
      parentName: "Mammal",
      hasDependencies: false,
      dependsOn: null,
      location: {
        start: {
          offset: 0,
          line: 1,
          column: 1,
        },
        end: {
          offset: 39,
          line: 3,
          column: 2,
        },
      },
    },
    {
      type: "entity",
      name: "Mammal",
      attributes: [
        {
          name: "hasHair",
          location: {
            start: {
              offset: 73,
              line: 6,
              column: 2,
            },
            end: {
              offset: 80,
              line: 6,
              column: 9,
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
          offset: 41,
          line: 5,
          column: 1,
        },
        end: {
          offset: 82,
          line: 7,
          column: 2,
        },
      },
    },
    {
      type: "entity",
      name: "Animal",
      attributes: [
        {
          name: "age",
          location: {
            start: {
              offset: 114,
              line: 10,
              column: 2,
            },
            end: {
              offset: 117,
              line: 10,
              column: 5,
            },
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null,
        },
      ],
      hasParent: true,
      parentName: "Life",
      hasDependencies: false,
      dependsOn: null,
      location: {
        start: {
          offset: 84,
          line: 9,
          column: 1,
        },
        end: {
          offset: 119,
          line: 11,
          column: 2,
        },
      },
    },
    {
      type: "entity",
      name: "Life",
      attributes: [
        {
          name: "l_id",
          location: {
            start: {
              offset: 136,
              line: 14,
              column: 2,
            },
            end: {
              offset: 144,
              line: 14,
              column: 10,
            },
          },
          isKey: true,
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
          offset: 121,
          line: 13,
          column: 1,
        },
        end: {
          offset: 146,
          line: 15,
          column: 2,
        },
      },
    },
  ],
  relationships: [],
  aggregations: [],
};
