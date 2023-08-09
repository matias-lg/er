import { checkEntityNoPrimaryKey } from "../../src/linter/checkEntityNoPrimaryKey";
import { SemanticErrorType } from "../../src/types/linter/SemanticError";
import { ER } from "../../src/types/parser/ER";

describe("Linter detects entities without a primary key", () => {
  it("Detects an entity without a primary key", () => {
    const er: ER = EREntityNoPrimaryKey;
    const errors = checkEntityNoPrimaryKey(er);
    expect(errors.length).toBe(1);
    expect(errors[0].type).toBe(SemanticErrorType.ENTITY_NO_PRIMARY_KEY);
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
    const errors = checkEntityNoPrimaryKey(er);
    expect(errors.length).toBe(0);
  });

  it("Finds more than one error when there's more than 1 wrong entity", () => {
    const er: ER = ERWith2WrongEntities;
    const errors = checkEntityNoPrimaryKey(er);
    expect(errors.length).toBe(2);
  })

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
const ERWith2WrongEntities: ER =
{
  entities: [
    {
      type: 'entity',
      name: 'keyboard',
      attributes: [
        {
          name: 'model',
          location: {
            start: {
              offset: 19,
              line: 2,
              column: 2
            },
            end: {
              offset: 24,
              line: 2,
              column: 7
            }
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null
        },
        {
          name: 'brand',
          location: {
            start: {
              offset: 29,
              line: 3,
              column: 5
            },
            end: {
              offset: 34,
              line: 3,
              column: 10
            }
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null
        },
        {
          name: 'switchType',
          location: {
            start: {
              offset: 39,
              line: 4,
              column: 5
            },
            end: {
              offset: 49,
              line: 4,
              column: 15
            }
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null
        }
      ],
      hasParent: false,
      parentName: null,
      hasDependencies: false,
      dependsOn: null,
      location: {
        start: {
          offset: 0,
          line: 1,
          column: 1
        },
        end: {
          offset: 51,
          line: 5,
          column: 2
        }
      }
    },
    {
      type: 'entity',
      name: 'mouse',
      attributes: [
        {
          name: 'model',
          location: {
            start: {
              offset: 70,
              line: 7,
              column: 5
            },
            end: {
              offset: 75,
              line: 7,
              column: 10
            }
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null
        },
        {
          name: 'brand',
          location: {
            start: {
              offset: 80,
              line: 8,
              column: 5
            },
            end: {
              offset: 85,
              line: 8,
              column: 10
            }
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null
        },
        {
          name: 'dpi',
          location: {
            start: {
              offset: 90,
              line: 9,
              column: 5
            },
            end: {
              offset: 93,
              line: 9,
              column: 8
            }
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null
        }
      ],
      hasParent: false,
      parentName: null,
      hasDependencies: false,
      dependsOn: null,
      location: {
        start: {
          offset: 52,
          line: 6,
          column: 1
        },
        end: {
          offset: 95,
          line: 10,
          column: 2
        }
      }
    }
  ],
  relationships: [],
  aggregations: []
}