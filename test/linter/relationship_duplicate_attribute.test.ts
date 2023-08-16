import { ER } from "../../src/types/parser/ER";
import { checkRelationshipDuplicateAttribute } from "../../src/linter/relationship/checkRelationshipDuplicateAttribute";

describe("Linter detects duplicate attributes in relationships", () => {
  it("Returns an error when there are duplicate attributes in a relationship", () => {
    const errors = checkRelationshipDuplicateAttribute(duplicateAttrER);
    expect(errors).toHaveLength(1);
    expect(errors[0].type).toBe("RELATIONSHIP_DUPLICATE_ATTRIBUTE");
    expect(errors[0].relationshipName).toBe("Owns");
    expect(errors[0].attributeName).toBe("since");
    expect(errors[0].location).toEqual({
      start: {
        offset: 50,
        line: 4,
        column: 3,
      },
      end: {
        offset: 55,
        line: 4,
        column: 8,
      },
    });
  });

  it("Returns two errors when there are two duplicate attributes in a relationship", () => {
    const errors = checkRelationshipDuplicateAttribute(twoDuplicateAttrER);
    expect(errors).toHaveLength(2);
    expect(errors[0].attributeName).toBe("buyPrice");
    expect(errors[1].attributeName).toBe("since");
  });

  it("Returns no errors when there are no duplicate attributes in a relationship", () => {
    const errors = checkRelationshipDuplicateAttribute(correctER);
    expect(errors).toHaveLength(0);
  });

  it("Returns no errors when there are no relationships", () => {
    const errors = checkRelationshipDuplicateAttribute({
      entities: [],
      relationships: [],
      aggregations: [],
    });
    expect(errors).toHaveLength(0);
  });
});

/*
relation Owns(Car, Person) {
  buyPrice
  since
  since
}
*/
const duplicateAttrER: ER = {
  entities: [],
  relationships: [
    {
      type: "relationship",
      name: "Owns",
      participantEntities: [
        {
          entityName: "Car",
          isComposite: false,
          cardinality: "N",
          participation: "partial",
          location: {
            start: {
              offset: 14,
              line: 1,
              column: 15,
            },
            end: {
              offset: 17,
              line: 1,
              column: 18,
            },
          },
        },
        {
          entityName: "Person",
          isComposite: false,
          cardinality: "N",
          participation: "partial",
          location: {
            start: {
              offset: 19,
              line: 1,
              column: 20,
            },
            end: {
              offset: 25,
              line: 1,
              column: 26,
            },
          },
        },
      ],
      attributes: [
        {
          name: "buyPrice",
          isComposite: false,
          childAttributesNames: null,
          location: {
            start: {
              offset: 31,
              line: 2,
              column: 3,
            },
            end: {
              offset: 39,
              line: 2,
              column: 11,
            },
          },
        },
        {
          name: "since",
          isComposite: false,
          childAttributesNames: null,
          location: {
            start: {
              offset: 42,
              line: 3,
              column: 3,
            },
            end: {
              offset: 47,
              line: 3,
              column: 8,
            },
          },
        },
        {
          name: "since",
          isComposite: false,
          childAttributesNames: null,
          location: {
            start: {
              offset: 50,
              line: 4,
              column: 3,
            },
            end: {
              offset: 55,
              line: 4,
              column: 8,
            },
          },
        },
      ],
      location: {
        start: {
          offset: 0,
          line: 1,
          column: 1,
        },
        end: {
          offset: 57,
          line: 5,
          column: 2,
        },
      },
    },
  ],
  aggregations: [],
};

/*
relation Owns(Car, Person) {
  buyPrice
  since
  buyPrice
  since
}
*/
const twoDuplicateAttrER: ER = {
  entities: [],
  relationships: [
    {
      type: "relationship",
      name: "Owns",
      participantEntities: [
        {
          entityName: "Car",
          isComposite: false,
          cardinality: "N",
          participation: "partial",
          location: {
            start: {
              offset: 14,
              line: 1,
              column: 15,
            },
            end: {
              offset: 17,
              line: 1,
              column: 18,
            },
          },
        },
        {
          entityName: "Person",
          isComposite: false,
          cardinality: "N",
          participation: "partial",
          location: {
            start: {
              offset: 19,
              line: 1,
              column: 20,
            },
            end: {
              offset: 25,
              line: 1,
              column: 26,
            },
          },
        },
      ],
      attributes: [
        {
          name: "buyPrice",
          isComposite: false,
          childAttributesNames: null,
          location: {
            start: {
              offset: 31,
              line: 2,
              column: 3,
            },
            end: {
              offset: 39,
              line: 2,
              column: 11,
            },
          },
        },
        {
          name: "since",
          isComposite: false,
          childAttributesNames: null,
          location: {
            start: {
              offset: 42,
              line: 3,
              column: 3,
            },
            end: {
              offset: 47,
              line: 3,
              column: 8,
            },
          },
        },
        {
          name: "buyPrice",
          isComposite: false,
          childAttributesNames: null,
          location: {
            start: {
              offset: 50,
              line: 4,
              column: 3,
            },
            end: {
              offset: 58,
              line: 4,
              column: 11,
            },
          },
        },
        {
          name: "since",
          isComposite: false,
          childAttributesNames: null,
          location: {
            start: {
              offset: 61,
              line: 5,
              column: 3,
            },
            end: {
              offset: 66,
              line: 5,
              column: 8,
            },
          },
        },
      ],
      location: {
        start: {
          offset: 0,
          line: 1,
          column: 1,
        },
        end: {
          offset: 68,
          line: 6,
          column: 2,
        },
      },
    },
  ],
  aggregations: [],
};

/*
relation Owns(Car, Person) {
  buyPrice
  since
}
*/
const correctER: ER = {
  entities: [],
  relationships: [
    {
      type: "relationship",
      name: "Owns",
      participantEntities: [
        {
          entityName: "Car",
          isComposite: false,
          cardinality: "N",
          participation: "partial",
          location: {
            start: {
              offset: 14,
              line: 1,
              column: 15,
            },
            end: {
              offset: 17,
              line: 1,
              column: 18,
            },
          },
        },
        {
          entityName: "Person",
          isComposite: false,
          cardinality: "N",
          participation: "partial",
          location: {
            start: {
              offset: 19,
              line: 1,
              column: 20,
            },
            end: {
              offset: 25,
              line: 1,
              column: 26,
            },
          },
        },
      ],
      attributes: [
        {
          name: "buyPrice",
          isComposite: false,
          childAttributesNames: null,
          location: {
            start: {
              offset: 31,
              line: 2,
              column: 3,
            },
            end: {
              offset: 39,
              line: 2,
              column: 11,
            },
          },
        },
        {
          name: "since",
          isComposite: false,
          childAttributesNames: null,
          location: {
            start: {
              offset: 42,
              line: 3,
              column: 3,
            },
            end: {
              offset: 47,
              line: 3,
              column: 8,
            },
          },
        },
      ],
      location: {
        start: {
          offset: 0,
          line: 1,
          column: 1,
        },
        end: {
          offset: 49,
          line: 4,
          column: 2,
        },
      },
    },
  ],
  aggregations: [],
};
