import { ER } from "../../src/types/ER";
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
    expect(er).toStrictEqual({
      entities: [
        {
          type: "entity",
          name: "Student",
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
              childAttributesNames: ["first_name", "last_name"],
            },
            {
              name: "age",
              isKey: false,
              isMultivalued: false,
              childAttributesNames: null,
            },
          ],
        },
        {
          type: "entity",
          name: "University",
          hasParent: false,
          parentName: null,
          hasDependencies: false,
          dependsOn: null,
          attributes: [
            {
              name: "name",
              isKey: false,
              isMultivalued: false,
              childAttributesNames: null,
            },
            {
              name: "address",
              isKey: false,
              isMultivalued: false,
              childAttributesNames: null,
            },
            {
              name: "foundation_date",
              isKey: false,
              isMultivalued: false,
              childAttributesNames: null,
            },
            {
              name: "university_id",
              isKey: true,
              isMultivalued: false,
              childAttributesNames: null,
            },
          ],
        },
      ],
      relationships: [
        {
          type: "relationship",
          name: "Attends",
          participantEntities: [
            {
              entityName: "student",
              isMultivalued: false,
              cardinality: "1",
              participation: "partial",
            },
            {
              entityName: "university",
              isMultivalued: false,
              cardinality: "N",
              participation: "total",
            },
          ],
          attributes: [
            {
              name: "enrollment_date",
              isMultivalued: false,
              childAttributesNames: null,
            },
          ],
        },
      ],
      aggregations: [
        {
          type: "aggregation",
          name: "Student_attends_university",
          aggregatedRelationshipName: "Attends",
        },
      ],
    } as ER);
  });
});
