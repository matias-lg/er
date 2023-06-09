import { ER } from "../../src/types/er";
import parser from "../../src/parser";

const simpleEntity = `
entity Dog {
    name key
    age
    breed
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
        RUT key
        full_name: [name, last_name]
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

describe("Parses Entities", () => {
  it("parses a simple entity", () => {
    const er: ER = parser.parse(simpleEntity);
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
      relations: [],
    });
  });

  it("Parses an entity that extends another", () => {
    const er: ER = parser.parse(entityWithParent);
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
      relations: [],
    });
  });

  it("Parses an entity with multivalued attributes", () => {
    const er: ER = parser.parse(entityWithMultivaluedAttribute);
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
              name: "RUT",
              isKey: true,
              isMultivalued: false,
              childAttributesNames: null,
            },
            {
              name: "full_name",
              isKey: false,
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
      relations: [],
    });
  });

  it("Parses an entity that depends on another", () => {
    const er: ER = parser.parse(entityWithDependencies);
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
            relationName: "Compiles",
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
      relations: [],
    });
  });
});
