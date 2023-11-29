import { ER } from "../../../src/ERDoc/types/parser/ER";
import { checkRelationshipDuplicateAttribute } from "../../../src/ERDoc/linter/relationship/checkRelationshipDuplicateAttribute";
import { parse } from "../../../src/ERDoc/parser";

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

const duplicateAttrER: ER = parse(`relation Owns(Car, Person) {
  buyPrice
  since
  since
}`);
const twoDuplicateAttrER: ER = parse(`relation Owns(Car, Person) {
  buyPrice
  since
  buyPrice
  since
}`);

const correctER: ER = parse(`relation Owns(Car, Person) {
  buyPrice
  since
}`);
