import { ER } from "../../../src/ERDoc/types/parser/ER";
import { Relationship } from "../../../src/ERDoc/types/parser/Relationship";
import { parse } from "../../../src/ERDoc/parser";

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
            isComposite: false,
            cardinality: "N",
            participation: "partial",
            location: {
              start: {
                offset: 18,
                line: 2,
                column: 18,
              },
              end: {
                offset: 25,
                line: 2,
                column: 25,
              },
            },
          },
          {
            entityName: "professor",
            isComposite: false,
            cardinality: "N",
            participation: "partial",
            location: {
              start: {
                offset: 27,
                line: 2,
                column: 27,
              },
              end: {
                offset: 36,
                line: 2,
                column: 36,
              },
            },
          },
        ],
        attributes: [
          {
            name: "subject",
            isComposite: false,
            childAttributesNames: null,
            location: {
              start: {
                offset: 42,
                line: 3,
                column: 4,
              },
              end: {
                offset: 49,
                line: 3,
                column: 11,
              },
            },
          },
        ],
        location: {
          start: {
            offset: 1,
            line: 2,
            column: 1,
          },
          end: {
            offset: 52,
            line: 4,
            column: 2,
          },
        },
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
            isComposite: false,
            cardinality: "M",
            participation: "partial",
            location: {
              start: {
                offset: 18,
                line: 2,
                column: 18,
              },
              end: {
                offset: 26,
                line: 2,
                column: 26,
              },
            },
          },
          {
            entityName: "concert",
            isComposite: false,
            cardinality: "1",
            participation: "partial",
            location: {
              start: {
                offset: 28,
                line: 2,
                column: 28,
              },
              end: {
                offset: 37,
                line: 2,
                column: 37,
              },
            },
          },
        ],
        attributes: [
          {
            name: "seat_number",
            isComposite: false,
            childAttributesNames: null,
            location: {
              start: {
                offset: 45,
                line: 3,
                column: 5,
              },
              end: {
                offset: 56,
                line: 3,
                column: 16,
              },
            },
          },
        ],
        location: {
          start: {
            offset: 1,
            line: 2,
            column: 1,
          },
          end: {
            offset: 58,
            line: 4,
            column: 2,
          },
        },
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
            isComposite: false,
            cardinality: "M",
            participation: "total",
            location: {
              start: {
                offset: 18,
                line: 2,
                column: 18,
              },
              end: {
                offset: 27,
                line: 2,
                column: 27,
              },
            },
          },
          {
            entityName: "concert",
            isComposite: false,
            cardinality: "1",
            participation: "total",
            location: {
              start: {
                offset: 29,
                line: 2,
                column: 29,
              },
              end: {
                offset: 39,
                line: 2,
                column: 39,
              },
            },
          },
        ],
        attributes: [
          {
            name: "seat_number",
            isComposite: false,
            childAttributesNames: null,
            location: {
              start: {
                offset: 47,
                line: 3,
                column: 5,
              },
              end: {
                offset: 58,
                line: 3,
                column: 16,
              },
            },
          },
        ],
        location: {
          start: {
            offset: 1,
            line: 2,
            column: 1,
          },
          end: {
            offset: 60,
            line: 4,
            column: 2,
          },
        },
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
            isComposite: false,
            cardinality: "M",
            participation: "total",
            location: {
              start: {
                offset: 17,
                line: 1,
                column: 18,
              },
              end: {
                offset: 26,
                line: 1,
                column: 27,
              },
            },
          },
          {
            entityName: "concert",
            isComposite: false,
            cardinality: "1",
            participation: "total",
            location: {
              start: {
                offset: 28,
                line: 1,
                column: 29,
              },
              end: {
                offset: 38,
                line: 1,
                column: 39,
              },
            },
          },
        ],
        attributes: [],
        location: {
          start: {
            offset: 0,
            line: 1,
            column: 1,
          },
          end: {
            offset: 39,
            line: 1,
            column: 40,
          },
        },
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
            isComposite: false,
            cardinality: "M",
            participation: "total",
            location: {
              start: {
                offset: 15,
                line: 1,
                column: 16,
              },
              end: {
                offset: 27,
                line: 1,
                column: 28,
              },
            },
          },
          {
            entityName: "player",
            isComposite: false,
            cardinality: "1",
            participation: "total",
            location: {
              start: {
                offset: 29,
                line: 1,
                column: 30,
              },
              end: {
                offset: 38,
                line: 1,
                column: 39,
              },
            },
          },
        ],
        attributes: [],
        location: {
          start: {
            offset: 0,
            line: 1,
            column: 1,
          },
          end: {
            offset: 41,
            line: 1,
            column: 42,
          },
        },
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
            isComposite: true,
            childParticipants: [
              {
                entityName: "seller",
                isComposite: false,
                cardinality: "1",
                participation: "total",
                location: {
                  start: {
                    offset: 22,
                    line: 1,
                    column: 23,
                  },
                  end: {
                    offset: 31,
                    line: 1,
                    column: 32,
                  },
                },
              },
              {
                entityName: "buyer",
                isComposite: false,
                cardinality: "N",
                participation: "partial",
                location: {
                  start: {
                    offset: 33,
                    line: 1,
                    column: 34,
                  },
                  end: {
                    offset: 40,
                    line: 1,
                    column: 41,
                  },
                },
              },
            ],
            location: {
              start: {
                offset: 14,
                line: 1,
                column: 15,
              },
              end: {
                offset: 41,
                line: 1,
                column: 42,
              },
            },
          },
        ],
        attributes: [],
        location: {
          start: {
            offset: 0,
            line: 1,
            column: 1,
          },
          end: {
            offset: 42,
            line: 1,
            column: 43,
          },
        },
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
            isComposite: true,
            childParticipants: [
              {
                entityName: "seller",
                isComposite: false,
                cardinality: "1",
                participation: "total",
                location: {
                  start: {
                    offset: 23,
                    line: 2,
                    column: 23,
                  },
                  end: {
                    offset: 32,
                    line: 2,
                    column: 32,
                  },
                },
              },
              {
                entityName: "buyer",
                isComposite: false,
                cardinality: "N",
                participation: "partial",
                location: {
                  start: {
                    offset: 34,
                    line: 2,
                    column: 34,
                  },
                  end: {
                    offset: 41,
                    line: 2,
                    column: 41,
                  },
                },
              },
            ],
            location: {
              start: {
                offset: 15,
                line: 2,
                column: 15,
              },
              end: {
                offset: 42,
                line: 2,
                column: 42,
              },
            },
          },
          {
            entityName: "product",
            isComposite: false,
            cardinality: "M",
            participation: "total",
            location: {
              start: {
                offset: 44,
                line: 2,
                column: 44,
              },
              end: {
                offset: 54,
                line: 2,
                column: 54,
              },
            },
          },
          {
            entityName: "place",
            isComposite: true,
            childParticipants: [
              {
                entityName: "store",
                isComposite: false,
                cardinality: "1",
                participation: "total",
                location: {
                  start: {
                    offset: 64,
                    line: 2,
                    column: 64,
                  },
                  end: {
                    offset: 72,
                    line: 2,
                    column: 72,
                  },
                },
              },
              {
                entityName: "country",
                isComposite: false,
                cardinality: "1",
                participation: "total",
                location: {
                  start: {
                    offset: 74,
                    line: 2,
                    column: 74,
                  },
                  end: {
                    offset: 84,
                    line: 2,
                    column: 84,
                  },
                },
              },
            ],
            location: {
              start: {
                offset: 56,
                line: 2,
                column: 56,
              },
              end: {
                offset: 85,
                line: 2,
                column: 85,
              },
            },
          },
        ],
        attributes: [
          {
            name: "date",
            isComposite: false,
            childAttributesNames: null,
            location: {
              start: {
                offset: 92,
                line: 3,
                column: 5,
              },
              end: {
                offset: 96,
                line: 3,
                column: 9,
              },
            },
          },
        ],
        location: {
          start: {
            offset: 1,
            line: 2,
            column: 1,
          },
          end: {
            offset: 98,
            line: 4,
            column: 2,
          },
        },
      },
    ]);
  });

  it("Throws an error when parsing bad constructed relationships", () => {
    badRelationships.forEach((badRelationship) => {
      expect(() => parse(badRelationship)).toThrowError();
    });
  });
});
