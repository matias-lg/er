import { ER } from "../../../src/ERDoc/types/parser/ER";
import { checkWeakEntityNoPkey } from "../../../src/ERDoc/linter/entity/checkWeakEntityNoPkey";
import { parse } from "../../../src/ERDoc/parser";

const only1ErrorER: ER = parse(`
entity Course {
    code key
    name
}

entity Evaluation depends on of {
    name
    date
}

relation of(Course 1, Evaluation 1!)

entity Grade depends on eval, belongs_to {
    question
    value
}

entity Student {
    s_id key
    name
}

relation eval(Grade 1!, Evaluation 1)
relation belongs_to(Grade 1!, Student)`);

const noPkeyER: ER = parse(`
                    entity Course {
                        code key
                    }

                    entity Assignment depends on From {
                        as_no
                    }

                    relation From(Assignment 1!, Course)
                    `);

const withPkeyEr: ER = parse(`
                    entity Course {
                        code key
                    }

                    entity Assignment depends on From {
                        as_no pkey
                    }

                    relation From(Assignment 1!, Course)
                    `);

const oneToOneEr: ER = parse(`
                    entity Course {
                        code key
                    }

                    entity Assignment depends on From {
                        as_no
                    }

                    relation From(Assignment 1!, Course 1)
                    `);

const multipleWrongEr: ER = parse(`
                    entity Course {
                        code key
                    }
                    entity Assignment depends on From {
                        as_no
                    }

                    relation From(Assignment 1!, Course)

                    entity Course2 {
                        code key
                    }

                    entity Assignment2 depends on From2 {
                        as_no
                    }

                    relation From2(Assignment2 1!, Course2)


                    entity Course3 {
                        code key
                    }

                    entity Assignment3 depends on From3 {
                        as_no
                    }

                    relation From3(Assignment3 1!, Course3)
    `);

describe("Linter detects that a weak entity must have a pkey in a one to many relationship", () => {
  it("Finds an error when a weak entity doesn't have a pkey and a strong entity is 'many'", () => {
    const errors = checkWeakEntityNoPkey(noPkeyER);
    expect(errors[0].type).toBe("WEAK_ENTITY_HAS_NO_PKEY");
    expect(errors.length).toBe(1);
    expect(errors[0].entityName).toBe("Assignment");
  });

  it("Finds no error when a weak entity has a pkey", () => {
    const errors = checkWeakEntityNoPkey(withPkeyEr);
    expect(errors.length).toBe(0);
  });

  it("Finds no error when a weak entity has no pkey but strong entity has cardinality of 1", () => {
    const errors = checkWeakEntityNoPkey(oneToOneEr);
    expect(errors.length).toBe(0);
  });

  it("Finds multiple errors with multiple wrong weak entities", () => {
    const errors = checkWeakEntityNoPkey(multipleWrongEr);
    expect(errors.length).toBe(3);
  });

  it("Finds only one error when two deps are many to many and no pkey", () => {
    const errors = checkWeakEntityNoPkey(only1ErrorER);
    expect(errors.length).toBe(1);
  });
});
