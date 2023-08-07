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
    expect(er).toStrictEqual<ER>({
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
              isComposite: false,
              childAttributesNames: null,
            },
            {
              name: "full_name",
              isKey: false,
              isComposite: true,
              childAttributesNames: ["first_name", "last_name"],
            },
            {
              name: "age",
              isKey: false,
              isComposite: false,
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
              isComposite: false,
              childAttributesNames: null,
            },
            {
              name: "address",
              isKey: false,
              isComposite: false,
              childAttributesNames: null,
            },
            {
              name: "foundation_date",
              isKey: false,
              isComposite: false,
              childAttributesNames: null,
            },
            {
              name: "university_id",
              isKey: true,
              isComposite: false,
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
              isComposite: false,
              cardinality: "1",
              participation: "partial",
            },
            {
              entityName: "university",
              isComposite: false,
              cardinality: "N",
              participation: "total",
            },
          ],
          attributes: [
            {
              name: "enrollment_date",
              isComposite: false,
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
          hasParent: true,
          parentName: "peripheral",
          hasDependencies: false,
          dependsOn: null,
          attributes: [
            {
              name: "switch_type",
              isKey: true,
              isComposite: false,
              childAttributesNames: null,
            },
            {
              name: "size",
              isKey: false,
              isComposite: false,
              childAttributesNames: null,
            },
          ],
        },
        {
          type: "entity",
          name: "deskmat",
          hasParent: false,
          parentName: null,
          hasDependencies: true,
          dependsOn: {
            relationshipName: "Uses",
          },
          attributes: [
            {
              name: "model_name",
              isKey: true,
              isComposite: false,
              childAttributesNames: null,
            },
            {
              name: "dimensions",
              isKey: false,
              isComposite: false,
              childAttributesNames: null,
            },
          ],
        },
        {
          type: "entity",
          name: "mouse",
          hasParent: true,
          parentName: "peripheral",
          hasDependencies: false,
          dependsOn: null,
          attributes: [
            {
              name: "sensor",
              isKey: true,
              isComposite: false,
              childAttributesNames: null,
            },
            {
              name: "isWireless",
              isKey: true,
              isComposite: false,
              childAttributesNames: null,
            },
          ],
        },
      ],
      relationships: [],
      aggregations: [],
    });
  });
});
