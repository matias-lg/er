import { checkEntityDuplicate } from "../../src/linter/checkEntityDuplicate";
import { ER } from "../../src/types/parser/ER";

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
        offset: 78,
        line: 9,
        column: 2,
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
        offset: 118,
        line: 14,
        column: 2,
      },
    });
  });

  it("Finds more than one duplicate", () => {
    const errors = checkEntityDuplicate(ERWith3DuplicateEntities);
    expect(errors).toHaveLength(3);
  });
});

/*
entity food {
	name key
    calories
}

entity food {
	name key
    calories
}
*/
const ERWithDuplicateEntities: ER = {
  entities: [
    {
      type: "entity",
      name: "food",
      attributes: [
        {
          name: "name",
          location: {
            start: {
              offset: 15,
              line: 2,
              column: 2,
            },
            end: {
              offset: 23,
              line: 2,
              column: 10,
            },
          },
          isKey: true,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "calories",
          location: {
            start: {
              offset: 28,
              line: 3,
              column: 5,
            },
            end: {
              offset: 36,
              line: 3,
              column: 13,
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
      name: "food",
      attributes: [
        {
          name: "name",
          location: {
            start: {
              offset: 55,
              line: 7,
              column: 2,
            },
            end: {
              offset: 63,
              line: 7,
              column: 10,
            },
          },
          isKey: true,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "calories",
          location: {
            start: {
              offset: 68,
              line: 8,
              column: 5,
            },
            end: {
              offset: 76,
              line: 8,
              column: 13,
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
          offset: 40,
          line: 6,
          column: 1,
        },
        end: {
          offset: 78,
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
entity human {
	name key
}

entity dog {
	name key
}
*/
const correctER: ER = {
  entities: [
    {
      type: "entity",
      name: "human",
      attributes: [
        {
          name: "name",
          location: {
            start: {
              offset: 16,
              line: 2,
              column: 2,
            },
            end: {
              offset: 24,
              line: 2,
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
          offset: 0,
          line: 1,
          column: 1,
        },
        end: {
          offset: 26,
          line: 3,
          column: 2,
        },
      },
    },
    {
      type: "entity",
      name: "dog",
      attributes: [
        {
          name: "name",
          location: {
            start: {
              offset: 42,
              line: 6,
              column: 2,
            },
            end: {
              offset: 50,
              line: 6,
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
          offset: 28,
          line: 5,
          column: 1,
        },
        end: {
          offset: 52,
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
entity food {
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
}
*/
const ERWith3SameEntities: ER = {
  entities: [
    {
      type: "entity",
      name: "food",
      attributes: [
        {
          name: "name",
          location: {
            start: {
              offset: 15,
              line: 2,
              column: 2,
            },
            end: {
              offset: 23,
              line: 2,
              column: 10,
            },
          },
          isKey: true,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "calories",
          location: {
            start: {
              offset: 28,
              line: 3,
              column: 5,
            },
            end: {
              offset: 36,
              line: 3,
              column: 13,
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
      name: "food",
      attributes: [
        {
          name: "name",
          location: {
            start: {
              offset: 55,
              line: 7,
              column: 2,
            },
            end: {
              offset: 63,
              line: 7,
              column: 10,
            },
          },
          isKey: true,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "calories",
          location: {
            start: {
              offset: 68,
              line: 8,
              column: 5,
            },
            end: {
              offset: 76,
              line: 8,
              column: 13,
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
          offset: 40,
          line: 6,
          column: 1,
        },
        end: {
          offset: 78,
          line: 9,
          column: 2,
        },
      },
    },
    {
      type: "entity",
      name: "food",
      attributes: [
        {
          name: "name",
          location: {
            start: {
              offset: 95,
              line: 12,
              column: 2,
            },
            end: {
              offset: 103,
              line: 12,
              column: 10,
            },
          },
          isKey: true,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "calories",
          location: {
            start: {
              offset: 108,
              line: 13,
              column: 5,
            },
            end: {
              offset: 116,
              line: 13,
              column: 13,
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
          offset: 80,
          line: 11,
          column: 1,
        },
        end: {
          offset: 118,
          line: 14,
          column: 2,
        },
      },
    },
  ],
  relationships: [],
  aggregations: [],
};
/*
entity food {
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
}
*/
const ERWith3DuplicateEntities: ER = {
  entities: [
    {
      type: "entity",
      name: "food",
      attributes: [
        {
          name: "name",
          location: {
            start: {
              offset: 15,
              line: 2,
              column: 2,
            },
            end: {
              offset: 23,
              line: 2,
              column: 10,
            },
          },
          isKey: true,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "calories",
          location: {
            start: {
              offset: 28,
              line: 3,
              column: 5,
            },
            end: {
              offset: 36,
              line: 3,
              column: 13,
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
      name: "cat",
      attributes: [
        {
          name: "name",
          location: {
            start: {
              offset: 54,
              line: 7,
              column: 2,
            },
            end: {
              offset: 62,
              line: 7,
              column: 10,
            },
          },
          isKey: true,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "hasChip",
          location: {
            start: {
              offset: 67,
              line: 8,
              column: 5,
            },
            end: {
              offset: 74,
              line: 8,
              column: 12,
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
          offset: 40,
          line: 6,
          column: 1,
        },
        end: {
          offset: 76,
          line: 9,
          column: 2,
        },
      },
    },
    {
      type: "entity",
      name: "food",
      attributes: [
        {
          name: "name",
          location: {
            start: {
              offset: 93,
              line: 12,
              column: 2,
            },
            end: {
              offset: 101,
              line: 12,
              column: 10,
            },
          },
          isKey: true,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "category",
          location: {
            start: {
              offset: 106,
              line: 13,
              column: 5,
            },
            end: {
              offset: 114,
              line: 13,
              column: 13,
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
          offset: 78,
          line: 11,
          column: 1,
        },
        end: {
          offset: 116,
          line: 14,
          column: 2,
        },
      },
    },
    {
      type: "entity",
      name: "dog",
      attributes: [
        {
          name: "name",
          location: {
            start: {
              offset: 132,
              line: 17,
              column: 2,
            },
            end: {
              offset: 140,
              line: 17,
              column: 10,
            },
          },
          isKey: true,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "breed",
          location: {
            start: {
              offset: 145,
              line: 18,
              column: 5,
            },
            end: {
              offset: 150,
              line: 18,
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
          offset: 118,
          line: 16,
          column: 1,
        },
        end: {
          offset: 152,
          line: 19,
          column: 2,
        },
      },
    },
    {
      type: "entity",
      name: "dog",
      attributes: [
        {
          name: "name",
          location: {
            start: {
              offset: 168,
              line: 22,
              column: 2,
            },
            end: {
              offset: 176,
              line: 22,
              column: 10,
            },
          },
          isKey: true,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "breed",
          location: {
            start: {
              offset: 181,
              line: 23,
              column: 5,
            },
            end: {
              offset: 186,
              line: 23,
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
          offset: 154,
          line: 21,
          column: 1,
        },
        end: {
          offset: 188,
          line: 24,
          column: 2,
        },
      },
    },
    {
      type: "entity",
      name: "cat",
      attributes: [
        {
          name: "name",
          location: {
            start: {
              offset: 204,
              line: 27,
              column: 2,
            },
            end: {
              offset: 212,
              line: 27,
              column: 10,
            },
          },
          isKey: true,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "isHungry",
          location: {
            start: {
              offset: 217,
              line: 28,
              column: 5,
            },
            end: {
              offset: 225,
              line: 28,
              column: 13,
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
          offset: 190,
          line: 26,
          column: 1,
        },
        end: {
          offset: 227,
          line: 29,
          column: 2,
        },
      },
    },
  ],
  relationships: [],
  aggregations: [],
};
