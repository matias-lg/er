import { ER } from "../../src/types/ER";
import { parse } from "../../src/parser";

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

const entityWithMultivaluedAttribute = `
   entity Person {
        full_name: [name, last_name] key
        age
        address: [street, city, country]
   } 
`;

const entityWithDependencies = `
   entity Program depends on OS through Compiles {
        language
        version
        file_extension
        filename key
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
];

const emptyEntity = `
    entity Void {}`;

describe("Parses Entities", () => {
  it("parses a simple entity", () => {
    const er: ER = parse(simpleEntity);
    expect(er).toStrictEqual({
      entities: [
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
              isMultivalued: false,
              childAttributesNames: null,
            },
            {
              name: "age",
              isKey: false,
              isMultivalued: false,
              childAttributesNames: null,
            },
            {
              name: "breed",
              isKey: false,
              isMultivalued: false,
              childAttributesNames: null,
            },
          ],
        },
      ],
      relationships: [],
      aggregations: [],
    } as ER);
  });

  it("Parses an entity that extends another", () => {
    const er: ER = parse(entityWithParent);
    expect(er).toStrictEqual({
      entities: [
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
              isMultivalued: false,
              childAttributesNames: null,
            },
            {
              name: "origin",
              isKey: false,
              isMultivalued: false,
              childAttributesNames: null,
            },
            {
              name: "intensity",
              isKey: false,
              isMultivalued: false,
              childAttributesNames: null,
            },
            {
              name: "roast_date",
              isKey: false,
              isMultivalued: false,
              childAttributesNames: null,
            },
          ],
        },
      ],
      relationships: [],
      aggregations: [],
    } as ER);
  });

  it("Parses an entity with multivalued attributes", () => {
    const er: ER = parse(entityWithMultivaluedAttribute);
    expect(er).toStrictEqual({
      entities: [
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
              isMultivalued: true,
              childAttributesNames: ["name", "last_name"],
            },
            {
              name: "age",
              isKey: false,
              isMultivalued: false,
              childAttributesNames: null,
            },
            {
              name: "address",
              isKey: false,
              isMultivalued: true,
              childAttributesNames: ["street", "city", "country"],
            },
          ],
        },
      ],
      relationships: [],
      aggregations: [],
    } as ER);
  });

  it("Parses an entity that depends on another", () => {
    const er: ER = parse(entityWithDependencies);
    expect(er).toStrictEqual({
      entities: [
        {
          type: "entity",
          name: "Program",
          hasParent: false,
          parentName: null,
          hasDependencies: true,
          dependsOn: {
            entityName: "OS",
            relationshipName: "Compiles",
          },
          attributes: [
            {
              name: "language",
              isKey: false,
              isMultivalued: false,
              childAttributesNames: null,
            },
            {
              name: "version",
              isKey: false,
              isMultivalued: false,
              childAttributesNames: null,
            },
            {
              name: "file_extension",
              isKey: false,
              isMultivalued: false,
              childAttributesNames: null,
            },
            {
              name: "filename",
              isKey: true,
              isMultivalued: false,
              childAttributesNames: null,
            },
          ],
        },
      ],
      relationships: [],
      aggregations: [],
    } as ER);
  });

  it("Parses an entity written inline", () => {
    const er: ER = parse(inlineSimpleEntity);
    expect(er).toStrictEqual({
      entities: [
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
              isMultivalued: false,
              childAttributesNames: null,
            },
          ],
        },
      ],
      relationships: [],
      aggregations: [],
    } as ER);
  });

  it("Parses an entity with mixed indentation", () => {
    const er: ER = parse(mixedIndentationEntity);
    expect(er).toStrictEqual({
      entities: [
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
              isMultivalued: false,
              childAttributesNames: null,
            },
            {
              name: "member2",
              isKey: true,
              isMultivalued: false,
              childAttributesNames: null,
            },
            {
              name: "member3",
              isKey: false,
              isMultivalued: false,
              childAttributesNames: null,
            },
          ],
        },
      ],
      relationships: [],
      aggregations: [],
    } as ER);
  });

  it("Parses an entity with tildes and ñ", () => {
    const er: ER = parse(entityWithTildeAndÑ);
    expect(er).toStrictEqual({
      entities: [
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
              isMultivalued: false,
              childAttributesNames: null,
            },
            {
              name: "sección",
              isKey: true,
              isMultivalued: false,
              childAttributesNames: null,
            },
            {
              name: "semestre",
              isKey: true,
              isMultivalued: false,
              childAttributesNames: null,
            },
            {
              name: "año",
              isKey: true,
              isMultivalued: false,
              childAttributesNames: null,
            },
            {
              name: "nombre",
              isKey: false,
              isMultivalued: false,
              childAttributesNames: null,
            },
          ],
        },
      ],
      relationships: [],
      aggregations: [],
    } as ER);
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
