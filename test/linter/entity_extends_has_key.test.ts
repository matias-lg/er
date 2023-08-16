import { ER } from "../../src/types/parser/ER";
import { checkChildEntityHasKey } from "../../src/linter/entity/checkChildEntityHasKey";

describe("Linter detects when a child entity has a key", () => {
  it("Returns an error when a child entity has a key", () => {
    const errors = checkChildEntityHasKey(wrongChildEntity);
    expect(errors.length).toBe(1);
    expect(errors[0].type).toBe("CHILD_ENTITY_HAS_KEY");
    expect(errors[0].entityName).toBe("Admin");
    expect(errors[0].location).toEqual({
      start: {
        offset: 0,
        line: 1,
        column: 1,
      },
      end: {
        offset: 47,
        line: 3,
        column: 2,
      },
    });
  });

  it("Does not return an error when a child entity does not have a key", () => {
    const errors = checkChildEntityHasKey(correctER);
    expect(errors.length).toBe(0);
  });

  it("Detects two errors with two wrong child entities", () => {
    const errors = checkChildEntityHasKey(twoWrongER);
    expect(errors.length).toBe(2);
  });

  it("Ignores regular entities", () => {
    const errors = checkChildEntityHasKey(regularEntitiesER);
    expect(errors.length).toBe(0);
  });
});
/*
entity Admin extends User {
  admin_email key
}
*/
const wrongChildEntity: ER = {
  entities: [
    {
      type: "entity",
      name: "Admin",
      attributes: [
        {
          name: "admin_email",
          location: {
            start: {
              offset: 30,
              line: 2,
              column: 3,
            },
            end: {
              offset: 45,
              line: 2,
              column: 18,
            },
          },
          isKey: true,
          isComposite: false,
          childAttributesNames: null,
        },
      ],
      hasParent: true,
      parentName: "User",
      hasDependencies: false,
      dependsOn: null,
      location: {
        start: {
          offset: 0,
          line: 1,
          column: 1,
        },
        end: {
          offset: 47,
          line: 3,
          column: 2,
        },
      },
    },
  ],
  relationships: [],
  aggregations: [],
};

/*
entity Admin extends User {
  canDeploy
}
*/
const correctER: ER = {
  entities: [
    {
      type: "entity",
      name: "Admin",
      attributes: [
        {
          name: "canDeploy",
          location: {
            start: {
              offset: 30,
              line: 2,
              column: 3,
            },
            end: {
              offset: 39,
              line: 2,
              column: 12,
            },
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null,
        },
      ],
      hasParent: true,
      parentName: "User",
      hasDependencies: false,
      dependsOn: null,
      location: {
        start: {
          offset: 0,
          line: 1,
          column: 1,
        },
        end: {
          offset: 41,
          line: 3,
          column: 2,
        },
      },
    },
  ],
  relationships: [],
  aggregations: [],
};

/*
entity Admin extends User {
  admin_email key
}

entity Moderator extends User {
  canEdit
}
entity Owner extends User {
  ownerRUT key
}
*/
const twoWrongER: ER = {
  entities: [
    {
      type: "entity",
      name: "Admin",
      attributes: [
        {
          name: "admin_email",
          location: {
            start: {
              offset: 30,
              line: 2,
              column: 3,
            },
            end: {
              offset: 45,
              line: 2,
              column: 18,
            },
          },
          isKey: true,
          isComposite: false,
          childAttributesNames: null,
        },
      ],
      hasParent: true,
      parentName: "User",
      hasDependencies: false,
      dependsOn: null,
      location: {
        start: {
          offset: 0,
          line: 1,
          column: 1,
        },
        end: {
          offset: 47,
          line: 3,
          column: 2,
        },
      },
    },
    {
      type: "entity",
      name: "Moderator",
      attributes: [
        {
          name: "canEdit",
          location: {
            start: {
              offset: 83,
              line: 6,
              column: 3,
            },
            end: {
              offset: 90,
              line: 6,
              column: 10,
            },
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null,
        },
      ],
      hasParent: true,
      parentName: "User",
      hasDependencies: false,
      dependsOn: null,
      location: {
        start: {
          offset: 49,
          line: 5,
          column: 1,
        },
        end: {
          offset: 92,
          line: 7,
          column: 2,
        },
      },
    },
    {
      type: "entity",
      name: "Owner",
      attributes: [
        {
          name: "ownerRUT",
          location: {
            start: {
              offset: 123,
              line: 9,
              column: 3,
            },
            end: {
              offset: 135,
              line: 9,
              column: 15,
            },
          },
          isKey: true,
          isComposite: false,
          childAttributesNames: null,
        },
      ],
      hasParent: true,
      parentName: "User",
      hasDependencies: false,
      dependsOn: null,
      location: {
        start: {
          offset: 93,
          line: 8,
          column: 1,
        },
        end: {
          offset: 137,
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
entity User {

  userID key
  username
  register_date
}

entity Post {
  postID
  postTitle
  postContent
}
*/
const regularEntitiesER: ER = {
  entities: [
    {
      type: "entity",
      name: "User",
      attributes: [
        {
          name: "userID",
          location: {
            start: {
              offset: 17,
              line: 3,
              column: 3,
            },
            end: {
              offset: 27,
              line: 3,
              column: 13,
            },
          },
          isKey: true,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "username",
          location: {
            start: {
              offset: 30,
              line: 4,
              column: 3,
            },
            end: {
              offset: 38,
              line: 4,
              column: 11,
            },
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "register_date",
          location: {
            start: {
              offset: 41,
              line: 5,
              column: 3,
            },
            end: {
              offset: 54,
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
          offset: 0,
          line: 1,
          column: 1,
        },
        end: {
          offset: 56,
          line: 6,
          column: 2,
        },
      },
    },
    {
      type: "entity",
      name: "Post",
      attributes: [
        {
          name: "postID",
          location: {
            start: {
              offset: 74,
              line: 9,
              column: 3,
            },
            end: {
              offset: 80,
              line: 9,
              column: 9,
            },
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "postTitle",
          location: {
            start: {
              offset: 83,
              line: 10,
              column: 3,
            },
            end: {
              offset: 92,
              line: 10,
              column: 12,
            },
          },
          isKey: false,
          isComposite: false,
          childAttributesNames: null,
        },
        {
          name: "postContent",
          location: {
            start: {
              offset: 95,
              line: 11,
              column: 3,
            },
            end: {
              offset: 106,
              line: 11,
              column: 14,
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
          offset: 58,
          line: 8,
          column: 1,
        },
        end: {
          offset: 108,
          line: 12,
          column: 2,
        },
      },
    },
  ],
  relationships: [],
  aggregations: [],
};
