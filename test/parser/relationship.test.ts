import { ER } from "../../src/types/ER";
import { parse } from "../../src/parser";

const simpleRelationship = `
relation Teaches(student, professor){
   subject 
}`;

const explicitCardinalitiesRelationship = `
relation Attends(person M, concert 1) {
    seat_number
}
`;

const explicitParticipationRelationship = `
relation Attends(person M!, concert 1!) {
    seat_number
}`;

const RelationshipsWithNoAttributes = `relation Attends(person M!, concert 1!)`;
const RelationshipsWithNoAttributesCurly = `relation Plays(videogame M!, player 1!){}`;

const multivaluedRelationship = `relation Buys(human: [seller 1!, buyer N])`;

const mixedRelationship = `
relation Buys(human: [seller 1!, buyer N], product M!, place: [store 1!, country 1!]){
    date
}`;

describe("Parses Relationships", () => {
  it("parses a simple relationship", () => {
    const er: ER = parse(simpleRelationship);
    expect(er).toStrictEqual({
      entities: [],
      relationships: [
        {
          type: "relationship",
          name: "Teaches",
          participantEntities: [
            {
              entityName: "student",
              isMultivalued: false,
              cardinality: "N",
              participation: "partial",
            },
            {
              entityName: "professor",
              isMultivalued: false,
              cardinality: "N",
              participation: "partial",
            },
          ],
          attributes: [
            {
              name: "subject",
              isMultivalued: false,
              childAttributesNames: null,
            },
          ],
        },
      ],
    } as ER);
  });

  it("parses a relationship with explicit cardinalities", () => {
    const er: ER = parse(explicitCardinalitiesRelationship);
    expect(er).toStrictEqual({
      entities: [],
      relationships: [
        {
          type: "relationship",
          name: "Attends",
          participantEntities: [
            {
              entityName: "person",
              isMultivalued: false,
              cardinality: "M",
              participation: "partial",
            },
            {
              entityName: "concert",
              isMultivalued: false,
              cardinality: "1",
              participation: "partial",
            },
          ],
          attributes: [
            {
              name: "seat_number",
              isMultivalued: false,
              childAttributesNames: null,
            },
          ],
        },
      ],
    } as ER);
  });

  it("parses a relationship with explicit cardinalities and participation", () => {
    const er: ER = parse(explicitParticipationRelationship);
    expect(er).toStrictEqual({
      entities: [],
      relationships: [
        {
          type: "relationship",
          name: "Attends",
          participantEntities: [
            {
              entityName: "person",
              isMultivalued: false,
              cardinality: "M",
              participation: "total",
            },
            {
              entityName: "concert",
              isMultivalued: false,
              cardinality: "1",
              participation: "total",
            },
          ],
          attributes: [
            {
              name: "seat_number",
              isMultivalued: false,
              childAttributesNames: null,
            },
          ],
        },
      ],
    } as ER);
  });

  it("parses relationships with no attributes", () => {
    const er = parse(RelationshipsWithNoAttributes);
    expect(er).toStrictEqual({
      entities: [],
      relationships: [
        {
          type: "relationship",
          name: "Attends",
          participantEntities: [
            {
              entityName: "person",
              cardinality: "M",
              isMultivalued: false,
              participation: "total",
            },
            {
              entityName: "concert",
              isMultivalued: false,
              cardinality: "1",
              participation: "total",
            },
          ],
          attributes: [],
        },
      ],
    } as ER);
  });

  it("parses relationships with no attributes with empty curlies", () => {
    const er = parse(RelationshipsWithNoAttributesCurly);
    expect(er).toStrictEqual({
      entities: [],
      relationships: [
        {
          type: "relationship",
          name: "Plays",
          participantEntities: [
            {
              entityName: "videogame",
              isMultivalued: false,
              cardinality: "M",
              participation: "total",
            },
            {
              entityName: "player",
              isMultivalued: false,
              cardinality: "1",
              participation: "total",
            },
          ],
          attributes: [],
        },
      ],
    } as ER);
  });

  it("parses relationships with multiple edges to same entity", () => {
    const er = parse(multivaluedRelationship);
    expect(er).toStrictEqual({
      entities: [],
      relationships: [
        {
          type: "relationship",
          name: "Buys",
          participantEntities: [
            {
              entityName: "human",
              isMultivalued: true,
              childParticipants: [
                {
                  entityName: "seller",
                  isMultivalued: false,
                  cardinality: "1",
                  participation: "total",
                },
                {
                  entityName: "buyer",
                  isMultivalued: false,
                  cardinality: "N",
                  participation: "partial",
                },
              ],
            },
          ],
          attributes: [],
        },
      ],
    } as ER);
  });

  it("parses relationships with multiedged entities and regular entities", () => {
    const er = parse(mixedRelationship);
    expect(er).toStrictEqual({
      entities: [],
      relationships: [
        {
          type: "relationship",
          name: "Buys",
          participantEntities: [
            {
              entityName: "human",
              isMultivalued: true,
              childParticipants: [
                {
                  entityName: "seller",
                  isMultivalued: false,
                  cardinality: "1",
                  participation: "total",
                },
                {
                  entityName: "buyer",
                  isMultivalued: false,
                  cardinality: "N",
                  participation: "partial",
                },
              ],
            },
            {
              entityName: "product",
              isMultivalued: false,
              cardinality: "M",
              participation: "total",
            },
            {
              entityName: "place",
              isMultivalued: true,
              childParticipants: [
                {
                  entityName: "store",
                  isMultivalued: false,
                  cardinality: "1",
                  participation: "total",
                },
                {
                  entityName: "country",
                  isMultivalued: false,
                  cardinality: "1",
                  participation: "total",
                },
              ],
            },
          ],
          attributes: [
            {
              name: "date",
              isMultivalued: false,
              childAttributesNames: null,
            },
          ],
        },
      ],
    });
  });
});
