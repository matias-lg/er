import { ER } from "../../src/types/parser/ER";
import { parse } from "../../src/parser";

describe("Parses ER Models with multiple elements", () => {
  it("parses a simple ER Model", () => {
    const simpleERModel = `
        entity Student {
            RUT key
            full_name: [first_name, last_name]
            age
        }

        entity University {
            name
            address
            foundation_date
            university_id key
        }

        Relation Attends(student 1, university N!) {
            enrollment_date
        }

        Aggregation Student_attends_university(Attends)`;

    const er = parse(simpleERModel);
    expect(er).toStrictEqual<ER>({
      entities: [
        {
          type: "entity",
          name: "Student",
          attributes: [
            {
              name: "RUT",
              location: {
                start: {
                  offset: 38,
                  line: 3,
                  column: 13,
                },
                end: {
                  offset: 45,
                  line: 3,
                  column: 20,
                },
              },
              isKey: true,
              isComposite: false,
              childAttributesNames: null,
            },
            {
              name: "full_name",
              location: {
                start: {
                  offset: 58,
                  line: 4,
                  column: 13,
                },
                end: {
                  offset: 92,
                  line: 4,
                  column: 47,
                },
              },
              isKey: false,
              isComposite: true,
              childAttributesNames: ["first_name", "last_name"],
            },
            {
              name: "age",
              location: {
                start: {
                  offset: 105,
                  line: 5,
                  column: 13,
                },
                end: {
                  offset: 108,
                  line: 5,
                  column: 16,
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
              offset: 9,
              line: 2,
              column: 9,
            },
            end: {
              offset: 118,
              line: 6,
              column: 10,
            },
          },
        },
        {
          type: "entity",
          name: "University",
          attributes: [
            {
              name: "name",
              location: {
                start: {
                  offset: 160,
                  line: 9,
                  column: 13,
                },
                end: {
                  offset: 164,
                  line: 9,
                  column: 17,
                },
              },
              isKey: false,
              isComposite: false,
              childAttributesNames: null,
            },
            {
              name: "address",
              location: {
                start: {
                  offset: 177,
                  line: 10,
                  column: 13,
                },
                end: {
                  offset: 184,
                  line: 10,
                  column: 20,
                },
              },
              isKey: false,
              isComposite: false,
              childAttributesNames: null,
            },
            {
              name: "foundation_date",
              location: {
                start: {
                  offset: 197,
                  line: 11,
                  column: 13,
                },
                end: {
                  offset: 212,
                  line: 11,
                  column: 28,
                },
              },
              isKey: false,
              isComposite: false,
              childAttributesNames: null,
            },
            {
              name: "university_id",
              location: {
                start: {
                  offset: 225,
                  line: 12,
                  column: 13,
                },
                end: {
                  offset: 242,
                  line: 12,
                  column: 30,
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
              offset: 128,
              line: 8,
              column: 9,
            },
            end: {
              offset: 252,
              line: 13,
              column: 10,
            },
          },
        },
      ],
      relationships: [
        {
          type: "relationship",
          name: "Attends",
          participantEntities: [
            {
              entityName: "student",
              isComposite: false,
              cardinality: "1",
              participation: "partial",
              location: {
                start: {
                  offset: 279,
                  line: 15,
                  column: 26,
                },
                end: {
                  offset: 288,
                  line: 15,
                  column: 35,
                },
              },
            },
            {
              entityName: "university",
              isComposite: false,
              cardinality: "N",
              participation: "total",
              location: {
                start: {
                  offset: 290,
                  line: 15,
                  column: 37,
                },
                end: {
                  offset: 303,
                  line: 15,
                  column: 50,
                },
              },
            },
          ],
          attributes: [
            {
              name: "enrollment_date",
              isComposite: false,
              childAttributesNames: null,
              location: {
                start: {
                  offset: 319,
                  line: 16,
                  column: 13,
                },
                end: {
                  offset: 334,
                  line: 16,
                  column: 28,
                },
              },
            },
          ],
          location: {
            start: {
              offset: 262,
              line: 15,
              column: 9,
            },
            end: {
              offset: 344,
              line: 17,
              column: 10,
            },
          },
        },
      ],
      aggregations: [
        {
          type: "aggregation",
          name: "Student_attends_university",
          location: {
            start: {
              offset: 354,
              line: 19,
              column: 9,
            },
            end: {
              offset: 401,
              line: 19,
              column: 56,
            },
          },
          aggregatedRelationshipName: "Attends",
        },
      ],
    });
  });

  it("Parses an ER Model with only entities", () => {
    const ER = `
        entity keyboard extends peripheral {
            switch_type key
            size
        }

        ENTITY deskmat DEPENDS ON Uses {
            model_name pkey
            dimensions 
        }

        ENTITY mouse extends peripheral {
            sensor key
            isWireless key
        }
     `;

    expect(parse(ER)).toStrictEqual<ER>({
      entities: [
        {
          type: "entity",
          name: "keyboard",
          attributes: [
            {
              name: "switch_type",
              location: {
                start: {
                  offset: 58,
                  line: 3,
                  column: 13,
                },
                end: {
                  offset: 73,
                  line: 3,
                  column: 28,
                },
              },
              isKey: true,
              isComposite: false,
              childAttributesNames: null,
            },
            {
              name: "size",
              location: {
                start: {
                  offset: 86,
                  line: 4,
                  column: 13,
                },
                end: {
                  offset: 90,
                  line: 4,
                  column: 17,
                },
              },
              isKey: false,
              isComposite: false,
              childAttributesNames: null,
            },
          ],
          hasParent: true,
          parentName: "peripheral",
          hasDependencies: false,
          dependsOn: null,
          location: {
            start: {
              offset: 9,
              line: 2,
              column: 9,
            },
            end: {
              offset: 100,
              line: 5,
              column: 10,
            },
          },
        },
        {
          type: "entity",
          name: "deskmat",
          attributes: [
            {
              name: "model_name",
              location: {
                start: {
                  offset: 155,
                  line: 8,
                  column: 13,
                },
                end: {
                  offset: 170,
                  line: 8,
                  column: 28,
                },
              },
              isKey: true,
              isComposite: false,
              childAttributesNames: null,
            },
            {
              name: "dimensions",
              location: {
                start: {
                  offset: 183,
                  line: 9,
                  column: 13,
                },
                end: {
                  offset: 194,
                  line: 9,
                  column: 24,
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
            relationshipName: "Uses",
          },
          location: {
            start: {
              offset: 110,
              line: 7,
              column: 9,
            },
            end: {
              offset: 204,
              line: 10,
              column: 10,
            },
          },
        },
        {
          type: "entity",
          name: "mouse",
          attributes: [
            {
              name: "sensor",
              location: {
                start: {
                  offset: 260,
                  line: 13,
                  column: 13,
                },
                end: {
                  offset: 270,
                  line: 13,
                  column: 23,
                },
              },
              isKey: true,
              isComposite: false,
              childAttributesNames: null,
            },
            {
              name: "isWireless",
              location: {
                start: {
                  offset: 283,
                  line: 14,
                  column: 13,
                },
                end: {
                  offset: 297,
                  line: 14,
                  column: 27,
                },
              },
              isKey: true,
              isComposite: false,
              childAttributesNames: null,
            },
          ],
          hasParent: true,
          parentName: "peripheral",
          hasDependencies: false,
          dependsOn: null,
          location: {
            start: {
              offset: 214,
              line: 12,
              column: 9,
            },
            end: {
              offset: 307,
              line: 15,
              column: 10,
            },
          },
        },
      ],
      relationships: [],
      aggregations: [],
    });
  });
});
