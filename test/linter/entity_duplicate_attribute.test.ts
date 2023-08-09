import { checkEntityDuplicateAttribute } from "../../src/linter/checkEntityDuplicateAttribute";
import { SemanticErrorType } from "../../src/types/linter/SemanticError";
import { ER } from "../../src/types/parser/ER";

describe("Linter detects duplicate attributes in entities", () => {
  it("detects a duplicate attribute in an entity", () => {
    const errors = checkEntityDuplicateAttribute(ERwithDuplicateAttribute);
    expect(errors).toHaveLength(1);
    expect(errors[0].type).toBe(SemanticErrorType.ENTITY_DUPLICATE_ATTRIBUTE);
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
      ERWithMultipleDuplicateAttributes
    );
    expect(errors).toHaveLength(2);
  });

  it("detects errors in 2 different entities", () => {
    const errors = checkEntityDuplicateAttribute(ERWith2WrongEntities);
    expect(errors).toHaveLength(2);
    expect(errors.find((error) => error.entityName === "Song")).toBeDefined();
    expect(errors.find((error) => error.entityName === "Dog")).toBeDefined();
  });
});

/*
entity Song {
    name key
    author
    author
}
*/
const ERwithDuplicateAttribute: ER = {
  entities: [
    {
      type: "entity",
      name: "Song",
      attributes: [
        {
          name: "name",
          location: {
            start: {
              offset: 18,
              line: 2,
              column: 5,
            },
            end: {
              offset: 26,
              line: 2,
              column: 13,
            },
          },
          isKey: true,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "author",
          location: {
            start: {
              offset: 31,
              line: 3,
              column: 5,
            },
            end: {
              offset: 37,
              line: 3,
              column: 11,
            },
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "author",
          location: {
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
          offset: 50,
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
entity Song {
    name key
    author
}
*/
const ERwithCorrectEntity: ER = {
  entities: [
    {
      type: "entity",
      name: "Song",
      attributes: [
        {
          name: "name",
          location: {
            start: {
              offset: 18,
              line: 2,
              column: 5,
            },
            end: {
              offset: 26,
              line: 2,
              column: 13,
            },
          },
          isKey: true,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "author",
          location: {
            start: {
              offset: 31,
              line: 3,
              column: 5,
            },
            end: {
              offset: 37,
              line: 3,
              column: 11,
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
          offset: 39,
          line: 4,
          column: 2,
        },
      },
    },
  ],
  relationships: [],
  aggregations: [],
};

/*
entity Song {
    name key
    name
    author
    author
}
*/
const ERWithMultipleDuplicateAttributes: ER = {
  entities: [
    {
      type: "entity",
      name: "Song",
      attributes: [
        {
          name: "name",
          location: {
            start: {
              offset: 18,
              line: 2,
              column: 5,
            },
            end: {
              offset: 26,
              line: 2,
              column: 13,
            },
          },
          isKey: true,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "name",
          location: {
            start: {
              offset: 31,
              line: 3,
              column: 5,
            },
            end: {
              offset: 35,
              line: 3,
              column: 9,
            },
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "author",
          location: {
            start: {
              offset: 40,
              line: 4,
              column: 5,
            },
            end: {
              offset: 46,
              line: 4,
              column: 11,
            },
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "author",
          location: {
            start: {
              offset: 51,
              line: 5,
              column: 5,
            },
            end: {
              offset: 57,
              line: 5,
              column: 11,
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
          line: 6,
          column: 2,
        },
      },
    },
  ],
  relationships: [],
  aggregations: [],
};
/*
entity Song {
    name key
    author
    author
}

entity Dog {
    name key
    name
}
*/
const ERWith2WrongEntities: ER = {
  entities: [
    {
      type: "entity",
      name: "Song",
      attributes: [
        {
          name: "name",
          location: {
            start: {
              offset: 18,
              line: 2,
              column: 5,
            },
            end: {
              offset: 26,
              line: 2,
              column: 13,
            },
          },
          isKey: true,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "author",
          location: {
            start: {
              offset: 31,
              line: 3,
              column: 5,
            },
            end: {
              offset: 37,
              line: 3,
              column: 11,
            },
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "author",
          location: {
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
          offset: 50,
          line: 5,
          column: 2,
        },
      },
    },
    {
      type: "entity",
      name: "Dog",
      attributes: [
        {
          name: "name",
          location: {
            start: {
              offset: 69,
              line: 8,
              column: 5,
            },
            end: {
              offset: 77,
              line: 8,
              column: 13,
            },
          },
          isKey: true,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "name",
          location: {
            start: {
              offset: 82,
              line: 9,
              column: 5,
            },
            end: {
              offset: 86,
              line: 9,
              column: 9,
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
          line: 7,
          column: 1,
        },
        end: {
          offset: 88,
          line: 10,
          column: 2,
        },
      },
    },
  ],
  relationships: [],
  aggregations: [],
};
