import { ER } from "../../src/types/ER";
import { parse } from "../../src/parser";
import { Entity } from "../../src/types/Entity";

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
    `
];

const emptyEntity = `
    entity Void {}`;

describe("Parses Entities", () => {
  it("parses a simple entity", () => {
    const er: ER = parse(simpleEntity);
    expect(er.entities).toStrictEqual<Entity[]>([
      {
        type: "entity",
        name: "Dog",
        hasParent: false,
        parentName: null,
        hasDependencies: false,
        dependsOn: null,
        attributes: [
          {
            name: "name",
            isKey: true,
            isComposite: false,
            childAttributesNames: null,
          },
          {
            name: "age",
            isKey: false,
            isComposite: false,
            childAttributesNames: null,
          },
          {
            name: "breed",
            isKey: false,
            isComposite: false,
            childAttributesNames: null,
          },
        ],
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
          },
          {
            name: "origin",
            isKey: false,
            isComposite: false,
            childAttributesNames: null,
          },
          {
            name: "intensity",
            isKey: false,
            isComposite: false,
            childAttributesNames: null,
          },
          {
            name: "roast_date",
            isKey: false,
            isComposite: false,
            childAttributesNames: null,
          },
        ],
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
          },
          {
            name: "age",
            isKey: false,
            isComposite: false,
            childAttributesNames: null,
          },
          {
            name: "address",
            isKey: false,
            isComposite: true,
            childAttributesNames: ["street", "city", "country"],
          },
        ],
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
          relationshipName: "Compiles",
        },
        attributes: [
          {
            name: "language",
            isKey: false,
            isComposite: false,
            childAttributesNames: null,
          },
          {
            name: "version",
            isKey: false,
            isComposite: false,
            childAttributesNames: null,
          },
          {
            name: "file_extension",
            isKey: false,
            isComposite: false,
            childAttributesNames: null,
          },
          {
            name: "filename",
            isKey: true,
            isComposite: false,
            childAttributesNames: null,
          },
        ],
      },
    ]);
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
          },
        ],
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
          },
          {
            name: "member2",
            isKey: true,
            isComposite: false,
            childAttributesNames: null,
          },
          {
            name: "member3",
            isKey: false,
            isComposite: false,
            childAttributesNames: null,
          },
        ],
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
          },
          {
            name: "sección",
            isKey: true,
            isComposite: false,
            childAttributesNames: null,
          },
          {
            name: "semestre",
            isKey: true,
            isComposite: false,
            childAttributesNames: null,
          },
          {
            name: "año",
            isKey: true,
            isComposite: false,
            childAttributesNames: null,
          },
          {
            name: "nombre",
            isKey: false,
            isComposite: false,
            childAttributesNames: null,
          },
        ],
      },
    ]);
  });

  it("Throws an error when parsing a bad constructed entity", () => {
    badEntities.forEach((entity) => {
      expect(() => parse(entity)).toThrowError();
    });
  });

  it("Throws an error when parsing an entity without attributes", () => {
    expect(() => parse(emptyEntity)).toThrowError();
  });
});
