import { checkEntityDuplicateAttribute } from "../../src/linter/checkEntityDuplicateAttribute";
import { SemanticErrorType } from "../../src/types/linter/SemanticError";
import { ER } from "../../src/types/parser/ER";

describe("Linter detects duplicate attributes in entities", () => {
  it("detects a duplicate attribute in an entity", () => {
    const errors = checkEntityDuplicateAttribute(ERwithDuplicateAttribute);
    expect(errors).toHaveLength(1);
    expect(errors[0].type).toBe(SemanticErrorType.ENTITY_DUPLICATE_ATTRIBUTE);
    expect(errors[0].entityName).toBe("Song");
    expect(errors[0].attributeName).toBe("author");
    expect(errors[0].location).toEqual({
      start: {
        offset: 42,
        line: 4,
        column: 5,
      },
      end: {
        offset: 48,
        line: 4,
        column: 11,
      },
    });
  });

  it("detects no errors in a correct entity", () => {
    const errors = checkEntityDuplicateAttribute(ERwithCorrectEntity);
    expect(errors).toHaveLength(0);
  });

  it("detects multiple errors in an entity", () => {
    const errors = checkEntityDuplicateAttribute(
      ERWithMultipleDuplicateAttributes
    );
    expect(errors).toHaveLength(2);
  });

  it("detects errors in 2 different entities", () => {
    const errors = checkEntityDuplicateAttribute(ERWith2WrongEntities);
    expect(errors).toHaveLength(2);
    expect(errors.find((error) => error.entityName === "Song")).toBeDefined();
    expect(errors.find((error) => error.entityName === "Dog")).toBeDefined();
  });

  it("detects error when duplicate is in subclass", () => {
    const errors = checkEntityDuplicateAttribute(ERWithWrongSubclass);
    expect(errors).toHaveLength(1);
    expect(errors[0].type).toBe(SemanticErrorType.ENTITY_DUPLICATE_ATTRIBUTE);
    expect(errors[0].entityName).toBe("Car");
    expect(errors[0].attributeName).toBe("Brand");
  })

  it("detects error when duplicate is in subsubclass", () => {
    const errors = checkEntityDuplicateAttribute(ERWithWrongSubclass2);
    expect (errors).toHaveLength(1);
    expect(errors[0].entityName).toBe("Ferrari");
    expect(errors[0].attributeName).toBe("Brand");
  })
});

/*
entity Song {
    name key
    author
    author
}
*/
const ERwithDuplicateAttribute: ER = {
  entities: [
    {
      type: "entity",
      name: "Song",
      attributes: [
        {
          name: "name",
          location: {
            start: {
              offset: 18,
              line: 2,
              column: 5,
            },
            end: {
              offset: 26,
              line: 2,
              column: 13,
            },
          },
          isKey: true,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "author",
          location: {
            start: {
              offset: 31,
              line: 3,
              column: 5,
            },
            end: {
              offset: 37,
              line: 3,
              column: 11,
            },
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "author",
          location: {
            start: {
              offset: 42,
              line: 4,
              column: 5,
            },
            end: {
              offset: 48,
              line: 4,
              column: 11,
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
          offset: 0,
          line: 1,
          column: 1,
        },
        end: {
          offset: 50,
          line: 5,
          column: 2,
        },
      },
    },
  ],
  relationships: [],
  aggregations: [],
};

/*
entity Song {
    name key
    author
}
*/
const ERwithCorrectEntity: ER = {
  entities: [
    {
      type: "entity",
      name: "Song",
      attributes: [
        {
          name: "name",
          location: {
            start: {
              offset: 18,
              line: 2,
              column: 5,
            },
            end: {
              offset: 26,
              line: 2,
              column: 13,
            },
          },
          isKey: true,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "author",
          location: {
            start: {
              offset: 31,
              line: 3,
              column: 5,
            },
            end: {
              offset: 37,
              line: 3,
              column: 11,
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
          offset: 0,
          line: 1,
          column: 1,
        },
        end: {
          offset: 39,
          line: 4,
          column: 2,
        },
      },
    },
  ],
  relationships: [],
  aggregations: [],
};

/*
entity Song {
    name key
    name
    author
    author
}
*/
const ERWithMultipleDuplicateAttributes: ER = {
  entities: [
    {
      type: "entity",
      name: "Song",
      attributes: [
        {
          name: "name",
          location: {
            start: {
              offset: 18,
              line: 2,
              column: 5,
            },
            end: {
              offset: 26,
              line: 2,
              column: 13,
            },
          },
          isKey: true,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "name",
          location: {
            start: {
              offset: 31,
              line: 3,
              column: 5,
            },
            end: {
              offset: 35,
              line: 3,
              column: 9,
            },
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "author",
          location: {
            start: {
              offset: 40,
              line: 4,
              column: 5,
            },
            end: {
              offset: 46,
              line: 4,
              column: 11,
            },
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "author",
          location: {
            start: {
              offset: 51,
              line: 5,
              column: 5,
            },
            end: {
              offset: 57,
              line: 5,
              column: 11,
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
          offset: 0,
          line: 1,
          column: 1,
        },
        end: {
          offset: 59,
          line: 6,
          column: 2,
        },
      },
    },
  ],
  relationships: [],
  aggregations: [],
};
/*
entity Song {
    name key
    author
    author
}

entity Dog {
    name key
    name
}
*/
const ERWith2WrongEntities: ER = {
  entities: [
    {
      type: "entity",
      name: "Song",
      attributes: [
        {
          name: "name",
          location: {
            start: {
              offset: 18,
              line: 2,
              column: 5,
            },
            end: {
              offset: 26,
              line: 2,
              column: 13,
            },
          },
          isKey: true,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "author",
          location: {
            start: {
              offset: 31,
              line: 3,
              column: 5,
            },
            end: {
              offset: 37,
              line: 3,
              column: 11,
            },
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "author",
          location: {
            start: {
              offset: 42,
              line: 4,
              column: 5,
            },
            end: {
              offset: 48,
              line: 4,
              column: 11,
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
          offset: 0,
          line: 1,
          column: 1,
        },
        end: {
          offset: 50,
          line: 5,
          column: 2,
        },
      },
    },
    {
      type: "entity",
      name: "Dog",
      attributes: [
        {
          name: "name",
          location: {
            start: {
              offset: 69,
              line: 8,
              column: 5,
            },
            end: {
              offset: 77,
              line: 8,
              column: 13,
            },
          },
          isKey: true,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "name",
          location: {
            start: {
              offset: 82,
              line: 9,
              column: 5,
            },
            end: {
              offset: 86,
              line: 9,
              column: 9,
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
          offset: 52,
          line: 7,
          column: 1,
        },
        end: {
          offset: 88,
          line: 10,
          column: 2,
        },
      },
    },
  ],
  relationships: [],
  aggregations: [],
};


/*
entity Vehicle {
  id key
  Brand
  License_plate_number}

entity Car extends Vehicle {
    Max_speed
    Brand
    N_passengers
}

entity Truck extends Vehicle {
  Tonnage
  N_of_axles
}
*/
const ERWithWrongSubclass: ER = 
{
  entities: [
    {
      type: 'entity',
      name: 'Vehicle',
      attributes: [
        {
          name: 'id',
          location: {
            start: {
              offset: 19,
              line: 2,
              column: 3
            },
            end: {
              offset: 25,
              line: 2,
              column: 9
            }
          },
          isKey: true,
          isComposite: false,
          childAttributesNames: null
        },
        {
          name: 'Brand',
          location: {
            start: {
              offset: 28,
              line: 3,
              column: 3
            },
            end: {
              offset: 33,
              line: 3,
              column: 8
            }
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null
        },
        {
          name: 'License_plate_number',
          location: {
            start: {
              offset: 36,
              line: 4,
              column: 3
            },
            end: {
              offset: 56,
              line: 4,
              column: 23
            }
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null
        }
      ],
      hasParent: false,
      parentName: null,
      hasDependencies: false,
      dependsOn: null,
      location: {
        start: {
          offset: 0,
          line: 1,
          column: 1
        },
        end: {
          offset: 57,
          line: 4,
          column: 24
        }
      }
    },
    {
      type: 'entity',
      name: 'Car',
      attributes: [
        {
          name: 'Max_speed',
          location: {
            start: {
              offset: 92,
              line: 7,
              column: 5
            },
            end: {
              offset: 101,
              line: 7,
              column: 14
            }
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null
        },
        {
          name: 'Brand',
          location: {
            start: {
              offset: 106,
              line: 8,
              column: 5
            },
            end: {
              offset: 111,
              line: 8,
              column: 10
            }
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null
        },
        {
          name: 'N_passengers',
          location: {
            start: {
              offset: 116,
              line: 9,
              column: 5
            },
            end: {
              offset: 128,
              line: 9,
              column: 17
            }
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null
        }
      ],
      hasParent: true,
      parentName: 'Vehicle',
      hasDependencies: false,
      dependsOn: null,
      location: {
        start: {
          offset: 59,
          line: 6,
          column: 1
        },
        end: {
          offset: 130,
          line: 10,
          column: 2
        }
      }
    },
    {
      type: 'entity',
      name: 'Truck',
      attributes: [
        {
          name: 'Tonnage',
          location: {
            start: {
              offset: 165,
              line: 13,
              column: 3
            },
            end: {
              offset: 172,
              line: 13,
              column: 10
            }
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null
        },
        {
          name: 'N_of_axles',
          location: {
            start: {
              offset: 175,
              line: 14,
              column: 3
            },
            end: {
              offset: 185,
              line: 14,
              column: 13
            }
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null
        }
      ],
      hasParent: true,
      parentName: 'Vehicle',
      hasDependencies: false,
      dependsOn: null,
      location: {
        start: {
          offset: 132,
          line: 12,
          column: 1
        },
        end: {
          offset: 187,
          line: 15,
          column: 2
        }
      }
    }
  ],
  relationships: [],
  aggregations: []
}

/*
entity Vehicle {
  id key
  Brand
  License_plate_number}

entity Car extends Vehicle {
    Max_speed
    N_passengers
}

entity Ferrari extends Car {
  Brand
  Color
}
*/
const ERWithWrongSubclass2: ER =
{
  entities: [
    {
      type: 'entity',
      name: 'Vehicle',
      attributes: [
        {
          name: 'id',
          location: {
            start: {
              offset: 19,
              line: 2,
              column: 3
            },
            end: {
              offset: 25,
              line: 2,
              column: 9
            }
          },
          isKey: true,
          isComposite: false,
          childAttributesNames: null
        },
        {
          name: 'Brand',
          location: {
            start: {
              offset: 28,
              line: 3,
              column: 3
            },
            end: {
              offset: 33,
              line: 3,
              column: 8
            }
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null
        },
        {
          name: 'License_plate_number',
          location: {
            start: {
              offset: 36,
              line: 4,
              column: 3
            },
            end: {
              offset: 56,
              line: 4,
              column: 23
            }
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null
        }
      ],
      hasParent: false,
      parentName: null,
      hasDependencies: false,
      dependsOn: null,
      location: {
        start: {
          offset: 0,
          line: 1,
          column: 1
        },
        end: {
          offset: 57,
          line: 4,
          column: 24
        }
      }
    },
    {
      type: 'entity',
      name: 'Car',
      attributes: [
        {
          name: 'Max_speed',
          location: {
            start: {
              offset: 92,
              line: 7,
              column: 5
            },
            end: {
              offset: 101,
              line: 7,
              column: 14
            }
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null
        },
        {
          name: 'N_passengers',
          location: {
            start: {
              offset: 106,
              line: 8,
              column: 5
            },
            end: {
              offset: 118,
              line: 8,
              column: 17
            }
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null
        }
      ],
      hasParent: true,
      parentName: 'Vehicle',
      hasDependencies: false,
      dependsOn: null,
      location: {
        start: {
          offset: 59,
          line: 6,
          column: 1
        },
        end: {
          offset: 120,
          line: 9,
          column: 2
        }
      }
    },
    {
      type: 'entity',
      name: 'Ferrari',
      attributes: [
        {
          name: 'Brand',
          location: {
            start: {
              offset: 153,
              line: 12,
              column: 3
            },
            end: {
              offset: 158,
              line: 12,
              column: 8
            }
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null
        },
        {
          name: 'Color',
          location: {
            start: {
              offset: 161,
              line: 13,
              column: 3
            },
            end: {
              offset: 166,
              line: 13,
              column: 8
            }
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null
        }
      ],
      hasParent: true,
      parentName: 'Car',
      hasDependencies: false,
      dependsOn: null,
      location: {
        start: {
          offset: 122,
          line: 11,
          column: 1
        },
        end: {
          offset: 168,
          line: 14,
          column: 2
        }
      }
    }
  ],
  relationships: [],
  aggregations: []
}