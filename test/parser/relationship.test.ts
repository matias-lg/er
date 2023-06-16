import { ER } from "../../src/types/ER";
import { Relationship } from "../../src/types/Relationship";
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

const badRelationships = [
  `relation Attends(person concert)`,
  `relation Attends(person N!!, concert)`,
  `relation Attends(person N!, concert M!){
        seat_number key
    }`,
  `relation Attends(person N!, concert M!){`,
  `relation Attends(person: concert){}`,
  `relation Attends(person, concert){`,
];

describe("Parses Relationships", () => {
  it("parses a simple relationship", () => {
    const er: ER = parse(simpleRelationship);
    expect(er.relationships).toStrictEqual<Relationship[]>([
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
    ]);
  });

  it("parses a relationship with explicit cardinalities", () => {
    const er: ER = parse(explicitCardinalitiesRelationship);
    expect(er.relationships).toStrictEqual<Relationship[]>([
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
    ]);
  });

  it("parses a relationship with explicit cardinalities and participation", () => {
    const er: ER = parse(explicitParticipationRelationship);
    expect(er.relationships).toStrictEqual<Relationship[]>([
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
    ]);
  });

  it("parses relationships with no attributes", () => {
    const er = parse(RelationshipsWithNoAttributes);
    expect(er.relationships).toStrictEqual<Relationship[]>([
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
    ]);
  });

  it("parses relationships with no attributes with empty curlies", () => {
    const er = parse(RelationshipsWithNoAttributesCurly);
    expect(er.relationships).toStrictEqual<Relationship[]>([
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
    ]);
  });

  it("parses relationships with multiple edges to same entity", () => {
    const er = parse(multivaluedRelationship);
    expect(er.relationships).toStrictEqual<Relationship[]>([
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
    ]);
  });

  it("parses relationships with multiedged entities and regular entities", () => {
    const er = parse(mixedRelationship);
    expect(er.relationships).toStrictEqual<Relationship[]>([
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
    ]);
  });

  it("Throws an error when parsing bad constructed relationships", () => {
    badRelationships.forEach((badRelationship) => {
      expect(() => parse(badRelationship)).toThrowError();
    });
  });
});
