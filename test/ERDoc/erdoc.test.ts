import { getERDoc } from "../../src/ERDoc";

describe("Parses and get semantic errors for a ERDoc string", () => {
  it("Should successfully parse and get no semantic errors for a semantically valid ERDoc string", () => {
    const correctERDoc = `
    entity User {
              userid key
              username
              password
              mail
            }
            entity Admin extends User {
              hasRootAccess
              canDeleteUsers
            }
            relation Manages(User,Admin)
            Aggregation ADMIN_MANAGES_USER(Manages)
    `;
    const [_, errors] = getERDoc(correctERDoc);
    expect(errors).toEqual([]);
  });

  it("Should find semantic errors for a wrong ERDoc", () => {
    const wrongERDoc = `
        entity Dog depends on Walks {
          name
          breed
          age
        }

        entity Person {
          name: [first_name, last_name] key
          age
          height
          bday
        }

        entity Worker extends Person {
          YoE key
        }

        relation Walks(Dog, Person) {
          duration
        }

        aggregation Person_walks_Dog(walks)
    `;
    const ERDoc = getERDoc(wrongERDoc);
    const [_, errors] = ERDoc;

    expect(errors.length).toBe(4);
    expect(
      errors.some((err) => err.type === "AGGREGATION_RELATIONSHIP_NOT_EXISTS"),
    ).toBe(true);

    expect(errors.some((err) => err.type === "CHILD_ENTITY_HAS_KEY")).toBe(
      true,
    );

    expect(
      errors.some((err) => err.type === "WEAK_ENTITY_NOT_TOTAL_PARTICIPATION"),
    ).toBe(true);

    expect(errors.some((err) => err.type === "WEAK_ENTITY_HAS_NO_PKEY")).toBe(
      true,
    );
  });
});
