import { ER } from "../../src/types/parser/ER";
import { checkWeakEntityHasTotalParticipation } from "../../src/linter/checkWeakEntityHasTotalParticipation";
import { parse } from "../../src/parser";

describe("Linter detects that a weak entity must have total participation in its identifying relationship", () => {
  it("Returns an error when a weak entity doesn't have total participation (implicit cardinality)", () => {
    const errors = checkWeakEntityHasTotalParticipation(implicitWrongER);
    expect(errors.length).toBe(1);
    expect(errors[0].type).toBe("WEAK_ENTITY_NOT_TOTAL_PARTICIPATION");
    expect(errors[0].entityName).toBe("Sun");
    expect(errors[0].relationshipName).toBe("BelongsTo");
    expect(errors[0].location).toEqual({
      start: {
        offset: 91,
        line: 6,
        column: 27,
      },
      end: {
        offset: 94,
        line: 6,
        column: 30,
      },
    });
  });

  it("Returns an error when a weak entity doesn't have total participation (explicit cardinality)", () => {
    const errors = checkWeakEntityHasTotalParticipation(explicitWrongER);
    expect(errors.length).toBe(1);
    expect(errors[0].type).toBe("WEAK_ENTITY_NOT_TOTAL_PARTICIPATION");
    expect(errors[0].entityName).toBe("Sun");
    expect(errors[0].relationshipName).toBe("BelongsTo");
  });

  it("Returns 2 errors when 2 Weak Entities don't have total participation in the same relationship", () => {
    const errors = checkWeakEntityHasTotalParticipation(
      twoWrongsIn1Relationship,
    );
    expect(errors.length).toBe(2);
    expect(errors.some((e) => e.entityName === "Sun")).toBe(true);
    expect(errors.some((e) => e.entityName === "Earth")).toBe(true);
  });

  it("Returns an error when a weak entity is composite and doesn't have total participation", () => {
    const errors = checkWeakEntityHasTotalParticipation(compositeWrongER);
    expect(errors.length).toBe(1);
    expect(errors[0].type).toBe("WEAK_ENTITY_NOT_TOTAL_PARTICIPATION");
    expect(errors[0].entityName).toBe("Sun");
  });

  it("Doesn't return error when a weak entity has total participation or relationship not present", () => {
    for (const er of noErrorsERs) {
      expect(checkWeakEntityHasTotalParticipation(er).length).toBe(0);
    }
  });
});

/*
entity Sun depends on BelongsTo {
    id pkey
    temperature
}

relation BelongsTo(Earth, Sun)
*/
const implicitWrongER: ER = {
  entities: [
    {
      type: "entity",
      name: "Sun",
      attributes: [
        {
          name: "id",
          location: {
            start: {
              offset: 38,
              line: 2,
              column: 5,
            },
            end: {
              offset: 45,
              line: 2,
              column: 12,
            },
          },
          isKey: true,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "temperature",
          location: {
            start: {
              offset: 50,
              line: 3,
              column: 5,
            },
            end: {
              offset: 61,
              line: 3,
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
      hasDependencies: true,
      dependsOn: {
        relationshipName: "BelongsTo",
      },
      location: {
        start: {
          offset: 0,
          line: 1,
          column: 1,
        },
        end: {
          offset: 63,
          line: 4,
          column: 2,
        },
      },
    },
  ],
  relationships: [
    {
      type: "relationship",
      name: "BelongsTo",
      participantEntities: [
        {
          entityName: "Earth",
          isComposite: false,
          cardinality: "N",
          participation: "partial",
          location: {
            start: {
              offset: 84,
              line: 6,
              column: 20,
            },
            end: {
              offset: 89,
              line: 6,
              column: 25,
            },
          },
        },
        {
          entityName: "Sun",
          isComposite: false,
          cardinality: "N",
          participation: "partial",
          location: {
            start: {
              offset: 91,
              line: 6,
              column: 27,
            },
            end: {
              offset: 94,
              line: 6,
              column: 30,
            },
          },
        },
      ],
      attributes: [],
      location: {
        start: {
          offset: 65,
          line: 6,
          column: 1,
        },
        end: {
          offset: 95,
          line: 6,
          column: 31,
        },
      },
    },
  ],
  aggregations: [],
};

/*
entity Sun depends on BelongsTo {
    id pkey
    temperature
}

relation BelongsTo(Earth, Sun N)
*/
const explicitWrongER: ER = {
  entities: [
    {
      type: "entity",
      name: "Sun",
      attributes: [
        {
          name: "id",
          location: {
            start: {
              offset: 38,
              line: 2,
              column: 5,
            },
            end: {
              offset: 45,
              line: 2,
              column: 12,
            },
          },
          isKey: true,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "temperature",
          location: {
            start: {
              offset: 50,
              line: 3,
              column: 5,
            },
            end: {
              offset: 61,
              line: 3,
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
      hasDependencies: true,
      dependsOn: {
        relationshipName: "BelongsTo",
      },
      location: {
        start: {
          offset: 0,
          line: 1,
          column: 1,
        },
        end: {
          offset: 63,
          line: 4,
          column: 2,
        },
      },
    },
  ],
  relationships: [
    {
      type: "relationship",
      name: "BelongsTo",
      participantEntities: [
        {
          entityName: "Earth",
          isComposite: false,
          cardinality: "N",
          participation: "partial",
          location: {
            start: {
              offset: 84,
              line: 6,
              column: 20,
            },
            end: {
              offset: 89,
              line: 6,
              column: 25,
            },
          },
        },
        {
          entityName: "Sun",
          isComposite: false,
          cardinality: "N",
          participation: "partial",
          location: {
            start: {
              offset: 91,
              line: 6,
              column: 27,
            },
            end: {
              offset: 96,
              line: 6,
              column: 32,
            },
          },
        },
      ],
      attributes: [],
      location: {
        start: {
          offset: 65,
          line: 6,
          column: 1,
        },
        end: {
          offset: 97,
          line: 6,
          column: 33,
        },
      },
    },
  ],
  aggregations: [],
};

/*
entity Sun depends on BelongsTo {
    id pkey
    temperature
}

relation BelongsTo(Earth, Sun: [SmallSun, BiggerSun N!])
*/
const compositeWrongER: ER = {
  entities: [
    {
      type: "entity",
      name: "Sun",
      attributes: [
        {
          name: "id",
          location: {
            start: {
              offset: 38,
              line: 2,
              column: 5,
            },
            end: {
              offset: 45,
              line: 2,
              column: 12,
            },
          },
          isKey: true,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "temperature",
          location: {
            start: {
              offset: 50,
              line: 3,
              column: 5,
            },
            end: {
              offset: 61,
              line: 3,
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
      hasDependencies: true,
      dependsOn: {
        relationshipName: "BelongsTo",
      },
      location: {
        start: {
          offset: 0,
          line: 1,
          column: 1,
        },
        end: {
          offset: 63,
          line: 4,
          column: 2,
        },
      },
    },
  ],
  relationships: [
    {
      type: "relationship",
      name: "BelongsTo",
      participantEntities: [
        {
          entityName: "Earth",
          isComposite: false,
          cardinality: "N",
          participation: "partial",
          location: {
            start: {
              offset: 84,
              line: 6,
              column: 20,
            },
            end: {
              offset: 89,
              line: 6,
              column: 25,
            },
          },
        },
        {
          entityName: "Sun",
          isComposite: true,
          childParticipants: [
            {
              entityName: "Sun",
              isComposite: false,
              cardinality: "N",
              participation: "partial",
              location: {
                start: {
                  offset: 97,
                  line: 6,
                  column: 33,
                },
                end: {
                  offset: 100,
                  line: 6,
                  column: 36,
                },
              },
            },
            {
              entityName: "BiggerSun",
              isComposite: false,
              cardinality: "N",
              participation: "total",
              location: {
                start: {
                  offset: 102,
                  line: 6,
                  column: 38,
                },
                end: {
                  offset: 114,
                  line: 6,
                  column: 50,
                },
              },
            },
          ],
          location: {
            start: {
              offset: 91,
              line: 6,
              column: 27,
            },
            end: {
              offset: 115,
              line: 6,
              column: 51,
            },
          },
        },
      ],
      attributes: [],
      location: {
        start: {
          offset: 65,
          line: 6,
          column: 1,
        },
        end: {
          offset: 116,
          line: 6,
          column: 52,
        },
      },
    },
  ],
  aggregations: [],
};

/*
entity Sun depends on BelongsTo {
    id pkey
    temperature
}

entity Earth depends on BelongsTo {
  id pkey
  population
}

relation BelongsTo(Earth, Sun)
*/
const twoWrongsIn1Relationship: ER = {
  entities: [
    {
      type: "entity",
      name: "Sun",
      attributes: [
        {
          name: "id",
          location: {
            start: {
              offset: 38,
              line: 2,
              column: 5,
            },
            end: {
              offset: 45,
              line: 2,
              column: 12,
            },
          },
          isKey: true,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "temperature",
          location: {
            start: {
              offset: 50,
              line: 3,
              column: 5,
            },
            end: {
              offset: 61,
              line: 3,
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
      hasDependencies: true,
      dependsOn: {
        relationshipName: "BelongsTo",
      },
      location: {
        start: {
          offset: 0,
          line: 1,
          column: 1,
        },
        end: {
          offset: 63,
          line: 4,
          column: 2,
        },
      },
    },
    {
      type: "entity",
      name: "Earth",
      attributes: [
        {
          name: "id",
          location: {
            start: {
              offset: 103,
              line: 7,
              column: 3,
            },
            end: {
              offset: 110,
              line: 7,
              column: 10,
            },
          },
          isKey: true,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "population",
          location: {
            start: {
              offset: 113,
              line: 8,
              column: 3,
            },
            end: {
              offset: 123,
              line: 8,
              column: 13,
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
        relationshipName: "BelongsTo",
      },
      location: {
        start: {
          offset: 65,
          line: 6,
          column: 1,
        },
        end: {
          offset: 125,
          line: 9,
          column: 2,
        },
      },
    },
  ],
  relationships: [
    {
      type: "relationship",
      name: "BelongsTo",
      participantEntities: [
        {
          entityName: "Earth",
          isComposite: false,
          cardinality: "N",
          participation: "partial",
          location: {
            start: {
              offset: 146,
              line: 11,
              column: 20,
            },
            end: {
              offset: 151,
              line: 11,
              column: 25,
            },
          },
        },
        {
          entityName: "Sun",
          isComposite: false,
          cardinality: "N",
          participation: "partial",
          location: {
            start: {
              offset: 153,
              line: 11,
              column: 27,
            },
            end: {
              offset: 156,
              line: 11,
              column: 30,
            },
          },
        },
      ],
      attributes: [],
      location: {
        start: {
          offset: 127,
          line: 11,
          column: 1,
        },
        end: {
          offset: 157,
          line: 11,
          column: 31,
        },
      },
    },
  ],
  aggregations: [],
};

const noErrorsERs: ER[] = [
  parse(`
entity Sun depends on BelongsTo {
    id pkey
    temperature
}

relation BelongsTo(Earth, Sun: [SmallSun 1!, BiggerSun N!])
  `),

  parse(`
entity Sun depends on BelongsTo {
    id pkey
    temperature
}

relation BelongsTo(Earth, Sun N!)
  `),

  parse(`
entity Sun depends on BelongsTo {
    id pkey
    temperature
}
relation BelongsTo(Earth, Sun 1!)
  `),

  parse(`
entity Sun depends on BelongsTo {
    id pkey
    temperature
}
  `),

  parse(`
  entity Sun {
    id key
    temperature
  }

  relation BelongsTo(Earth, Europe)
`),
];
