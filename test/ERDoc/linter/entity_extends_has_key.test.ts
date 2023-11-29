import { ER } from "../../../src/ERDoc/types/parser/ER";
import { parse } from "../../../src/ERDoc/parser";
import { checkChildEntityHasKey } from "../../../src/ERDoc/linter/entity/checkChildEntityHasKey";

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
        offset: 12,
        line: 1,
        column: 13,
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

const wrongChildEntity: ER = parse(`entity Admin extends User {
  admin_email key
}`);

const correctER: ER = parse(`entity Admin extends User {
  canDeploy
}`);

const twoWrongER: ER = parse(`entity Admin extends User {
  admin_email key
}

entity Moderator extends User {
  canEdit
}
entity Owner extends User {
  ownerRUT key
}`);

const regularEntitiesER: ER = parse(`entity User {

  userID key
  username
  register_date
}

entity Post {
  postID
  postTitle
  postContent
}`);
