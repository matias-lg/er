import { ER } from "../../../src/ERDoc/types/parser/ER";
import { parse } from "../../../src/ERDoc/parser";
import { Entity } from "../../../src/ERDoc/types/parser/Entity";

const simpleEntity = `
entity Dog {
    name key
    age
    breed
}
`;

const inlineSimpleEntity = `
entity tv extends electronic {brand key}
`;

const mixedIndentationEntity = `
entity test extends word {member
member2 key
  member3
}
`;

const entityWithParent = `
  ENTITY Coffee EXTENDS drink {
    name key
    origin
    intensity
    roast_date
  }
`;

const entityWithCompositeAttribute = `
   entity Person {
        full_name: [name, last_name] key
        age
        address: [street, city, country]
   } 
`;

const entityWithDependencies = `
   entity Program depends on Compiles {
        language
        version
        file_extension
        filename pkey
   }
`;

const entityWith2Deps = `
   entity Program depends on Compiles,Parses {
        language
        version
        file_extension
        filename pkey
   }
`;

const entityWith3Deps = `
   entity Program depends on Compiles, Parses, Lints {
        language
        version
        file_extension
        filename pkey
   }
`;

const entityWithTildeAndÑ = `
Entity Curso {
  codigo key
  sección key
  semestre key
  año key
  nombre
}`;

const badEntities = [
  `
    entity {
       position
    }`,
  `
        entity Food {
    `,

  `
    entity Food {
        name key key
        calories ies
    }
    `,
  `
    entity Meal extendds Food {
        main_ingredient
    }
    `,

  // regular entity using "pkey" instead of "key"
  `
    ENTITY Tea {
        name pkey
        origin
    }
    `,
  // weak entity using "key" instead of "pkey"
  `
   entity Program depends on Compiles {
        language
        version
        file_extension
        filename key
   }
    `,
  // weak entity extends another
  `
   entity Program depends on Compiles extends File {
        language
   }
    `,
  `entity Diagram depends on ,Draw {
      id pkey
    }`,
];

const emptyEntity = `entity Void {}`;

describe("Parses Entities", () => {
  it("parses a simple entity", () => {
    const er: ER = parse(simpleEntity);
    expect(er.entities).toStrictEqual<Entity[]>([
      {
        type: "entity",
        name: "Dog",
        attributes: [
          {
            name: "name",
            location: {
              start: {
                offset: 18,
                line: 3,
                column: 5,
              },
              end: {
                offset: 26,
                line: 3,
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
                offset: 31,
                line: 4,
                column: 5,
              },
              end: {
                offset: 34,
                line: 4,
                column: 8,
              },
            },
            isKey: false,
            isComposite: false,
            childAttributesNames: null,
          },
          {
            name: "breed",
            location: {
              start: {
                offset: 39,
                line: 5,
                column: 5,
              },
              end: {
                offset: 44,
                line: 5,
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
            offset: 1,
            line: 2,
            column: 1,
          },
          end: {
            offset: 11,
            line: 2,
            column: 11,
          },
        },
      },
    ]);
  });

  it("Parses an entity with no attributes", () => {
    const er: ER = parse(emptyEntity);
    expect(er.entities).toStrictEqual<Entity[]>([
      {
        type: "entity",
        name: "Void",
        hasParent: false,
        parentName: null,
        hasDependencies: false,
        location: {
          start: {
            offset: 0,
            line: 1,
            column: 1,
          },
          end: {
            offset: 11,
            line: 1,
            column: 12,
          },
        },
        dependsOn: null,
        attributes: [],
      },
    ]);
  });

  it("Parses an entity that extends another", () => {
    const er: ER = parse(entityWithParent);
    expect(er.entities).toStrictEqual<Entity[]>([
      {
        type: "entity",
        name: "Coffee",
        hasParent: true,
        parentName: "drink",
        hasDependencies: false,
        dependsOn: null,
        attributes: [
          {
            name: "name",
            isKey: true,
            isComposite: false,
            childAttributesNames: null,
            location: {
              start: {
                offset: 37,
                line: 3,
                column: 5,
              },
              end: {
                offset: 45,
                line: 3,
                column: 13,
              },
            },
          },
          {
            name: "origin",
            isKey: false,
            isComposite: false,
            childAttributesNames: null,
            location: {
              start: {
                offset: 50,
                line: 4,
                column: 5,
              },
              end: {
                offset: 56,
                line: 4,
                column: 11,
              },
            },
          },
          {
            name: "intensity",
            isKey: false,
            isComposite: false,
            childAttributesNames: null,
            location: {
              start: {
                offset: 61,
                line: 5,
                column: 5,
              },
              end: {
                offset: 70,
                line: 5,
                column: 14,
              },
            },
          },
          {
            name: "roast_date",
            isKey: false,
            isComposite: false,
            childAttributesNames: null,
            location: {
              start: {
                offset: 75,
                line: 6,
                column: 5,
              },
              end: {
                offset: 85,
                line: 6,
                column: 15,
              },
            },
          },
        ],
        location: {
          start: {
            offset: 3,
            line: 2,
            column: 3,
          },
          end: {
            offset: 16,
            line: 2,
            column: 16,
          },
        },
      },
    ]);
  });

  it("Parses an entity with composite attributes", () => {
    const er: ER = parse(entityWithCompositeAttribute);
    expect(er.entities).toStrictEqual<Entity[]>([
      {
        type: "entity",
        name: "Person",
        hasParent: false,
        parentName: null,
        hasDependencies: false,
        dependsOn: null,
        attributes: [
          {
            name: "full_name",
            isKey: true,
            isComposite: true,
            childAttributesNames: ["name", "last_name"],
            location: {
              start: {
                offset: 28,
                line: 3,
                column: 9,
              },
              end: {
                offset: 60,
                line: 3,
                column: 41,
              },
            },
          },
          {
            name: "age",
            isKey: false,
            isComposite: false,
            childAttributesNames: null,
            location: {
              start: {
                offset: 69,
                line: 4,
                column: 9,
              },
              end: {
                offset: 72,
                line: 4,
                column: 12,
              },
            },
          },
          {
            name: "address",
            isKey: false,
            isComposite: true,
            childAttributesNames: ["street", "city", "country"],
            location: {
              start: {
                offset: 81,
                line: 5,
                column: 9,
              },
              end: {
                offset: 113,
                line: 5,
                column: 41,
              },
            },
          },
        ],
        location: {
          start: {
            offset: 4,
            line: 2,
            column: 4,
          },
          end: {
            offset: 17,
            line: 2,
            column: 17,
          },
        },
      },
    ]);
  });

  it("Parses an entity that depends on another", () => {
    const er: ER = parse(entityWithDependencies);
    expect(er.entities).toStrictEqual<Entity[]>([
      {
        type: "entity",
        name: "Program",
        hasParent: false,
        parentName: null,
        hasDependencies: true,
        dependsOn: {
          relationshipName: ["Compiles"],
        },
        attributes: [
          {
            name: "language",
            isKey: false,
            isComposite: false,
            childAttributesNames: null,
            location: {
              start: {
                offset: 49,
                line: 3,
                column: 9,
              },
              end: {
                offset: 57,
                line: 3,
                column: 17,
              },
            },
          },
          {
            name: "version",
            isKey: false,
            isComposite: false,
            childAttributesNames: null,
            location: {
              start: {
                offset: 66,
                line: 4,
                column: 9,
              },
              end: {
                offset: 73,
                line: 4,
                column: 16,
              },
            },
          },
          {
            name: "file_extension",
            isKey: false,
            isComposite: false,
            childAttributesNames: null,
            location: {
              start: {
                offset: 82,
                line: 5,
                column: 9,
              },
              end: {
                offset: 96,
                line: 5,
                column: 23,
              },
            },
          },
          {
            name: "filename",
            isKey: true,
            isComposite: false,
            childAttributesNames: null,
            location: {
              start: {
                offset: 105,
                line: 6,
                column: 9,
              },
              end: {
                offset: 118,
                line: 6,
                column: 22,
              },
            },
          },
        ],
        location: {
          start: {
            offset: 4,
            line: 2,
            column: 4,
          },
          end: {
            offset: 18,
            line: 2,
            column: 18,
          },
        },
      },
    ]);
  });

  it("Parses a weak entity with 2 dependencies", () => {
    const er: ER = parse(entityWith2Deps);
    const entity = er.entities[0];
    expect(entity.dependsOn).toStrictEqual({
      relationshipName: ["Compiles", "Parses"],
    });
  });

  it("Parses a weak entity with 3 dependencies", () => {
    const er: ER = parse(entityWith3Deps);
    const entity = er.entities[0];
    expect(entity.dependsOn).toStrictEqual({
      relationshipName: ["Compiles", "Parses", "Lints"],
    });
  });

  it("Parses an entity written inline", () => {
    const er: ER = parse(inlineSimpleEntity);
    expect(er.entities).toStrictEqual<Entity[]>([
      {
        type: "entity",
        name: "tv",
        hasParent: true,
        parentName: "electronic",
        hasDependencies: false,
        dependsOn: null,
        attributes: [
          {
            name: "brand",
            isKey: true,
            isComposite: false,
            childAttributesNames: null,
            location: {
              start: {
                offset: 31,
                line: 2,
                column: 31,
              },
              end: {
                offset: 40,
                line: 2,
                column: 40,
              },
            },
          },
        ],
        location: {
          start: {
            offset: 1,
            line: 2,
            column: 1,
          },
          end: {
            offset: 10,
            line: 2,
            column: 10,
          },
        },
      },
    ]);
  });

  it("Parses an entity with mixed indentation", () => {
    const er: ER = parse(mixedIndentationEntity);
    expect(er.entities).toStrictEqual<Entity[]>([
      {
        type: "entity",
        name: "test",
        hasParent: true,
        parentName: "word",
        hasDependencies: false,
        dependsOn: null,
        attributes: [
          {
            name: "member",
            isKey: false,
            isComposite: false,
            childAttributesNames: null,
            location: {
              start: {
                offset: 27,
                line: 2,
                column: 27,
              },
              end: {
                offset: 33,
                line: 2,
                column: 33,
              },
            },
          },
          {
            name: "member2",
            isKey: true,
            isComposite: false,
            childAttributesNames: null,
            location: {
              start: {
                offset: 34,
                line: 3,
                column: 1,
              },
              end: {
                offset: 45,
                line: 3,
                column: 12,
              },
            },
          },
          {
            name: "member3",
            isKey: false,
            isComposite: false,
            childAttributesNames: null,
            location: {
              start: {
                offset: 48,
                line: 4,
                column: 3,
              },
              end: {
                offset: 55,
                line: 4,
                column: 10,
              },
            },
          },
        ],
        location: {
          start: {
            offset: 1,
            line: 2,
            column: 1,
          },
          end: {
            offset: 12,
            line: 2,
            column: 12,
          },
        },
      },
    ]);
  });

  it("Parses an entity with tildes and ñ", () => {
    const er: ER = parse(entityWithTildeAndÑ);
    expect(er.entities).toStrictEqual<Entity[]>([
      {
        type: "entity",
        name: "Curso",
        hasParent: false,
        parentName: null,
        hasDependencies: false,
        dependsOn: null,
        attributes: [
          {
            name: "codigo",
            isKey: true,
            isComposite: false,
            childAttributesNames: null,
            location: {
              start: {
                offset: 18,
                line: 3,
                column: 3,
              },
              end: {
                offset: 28,
                line: 3,
                column: 13,
              },
            },
          },
          {
            name: "sección",
            isKey: true,
            isComposite: false,
            childAttributesNames: null,
            location: {
              start: {
                offset: 31,
                line: 4,
                column: 3,
              },
              end: {
                offset: 42,
                line: 4,
                column: 14,
              },
            },
          },
          {
            name: "semestre",
            isKey: true,
            isComposite: false,
            childAttributesNames: null,
            location: {
              start: {
                offset: 45,
                line: 5,
                column: 3,
              },
              end: {
                offset: 57,
                line: 5,
                column: 15,
              },
            },
          },
          {
            name: "año",
            isKey: true,
            isComposite: false,
            childAttributesNames: null,
            location: {
              start: {
                offset: 60,
                line: 6,
                column: 3,
              },
              end: {
                offset: 67,
                line: 6,
                column: 10,
              },
            },
          },
          {
            name: "nombre",
            isKey: false,
            isComposite: false,
            childAttributesNames: null,
            location: {
              start: {
                offset: 70,
                line: 7,
                column: 3,
              },
              end: {
                offset: 76,
                line: 7,
                column: 9,
              },
            },
          },
        ],
        location: {
          start: {
            offset: 1,
            line: 2,
            column: 1,
          },
          end: {
            offset: 13,
            line: 2,
            column: 13,
          },
        },
      },
    ]);
  });

  it("Throws an error when parsing a bad constructed entity", () => {
    badEntities.forEach((entity) => {
      expect(() => parse(entity)).toThrowError();
    });
  });
});
