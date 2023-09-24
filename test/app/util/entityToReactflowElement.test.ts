import { getERDoc } from "../../../src/ERDoc";
import { entityToReactflowElements } from "../../../src/app/util/erToReactflowElements";

const getEntityFromERDoc = (erDoc: string, entityName: string) => {
  const [er, _] = getERDoc(erDoc);
  return er.entities.find((entity) => entity.name === entityName);
};

describe("Convert an entity to ReactFlow Nodes and Edges", () => {
  it("should convert a simple entity", () => {
    const entity = getEntityFromERDoc(simpleERDoc, "Human")!;
    const [nodes, edges] = entityToReactflowElements(entity);
    expect(nodes).toHaveLength(4);
    expect(edges).toHaveLength(3);
    expect(nodes.some((node) => node.id === "entity: Human")).toBe(true);
    expect(
      nodes.some(
        (node) =>
          node.id === "entity-attr: Human|h_id" &&
          node.type === "entity-attribute" &&
          node.data?.isKey,
      ),
    ).toBe(true);
    expect(nodes.some((node) => node.id === "entity-attr: Human|age")).toBe(
      true,
    );
    expect(nodes.some((node) => node.id === "entity-attr: Human|name")).toBe(
      true,
    );

    expect(edges.some((edge) => edge.id === "entity-attr: Human->age")).toBe(
      true,
    );
    expect(edges.some((edge) => edge.id === "entity-attr: Human->name")).toBe(
      true,
    );
    expect(edges.some((edge) => edge.id === "entity-attr: Human->h_id")).toBe(
      true,
    );
  });
  // TODO: Check edge cardinality and participation

  it("should convert a weak entity", () => {
    const entity = getEntityFromERDoc(weakEntity, "Human")!;
    const [nodes, edges] = entityToReactflowElements(entity);
    expect(nodes).toHaveLength(3);
    expect(edges).toHaveLength(2);
    expect(
      nodes.some(
        (node) =>
          node.id === "entity: Human" &&
          node.type === "entity" &&
          node.data.isWeak,
      ),
    ).toBe(true);
  });

  it("should convert an entity with composite attributes", () => {
    const entity = getEntityFromERDoc(compositeAttribute, "Dog")!;
    const [nodes, edges] = entityToReactflowElements(entity);
    expect(nodes).toHaveLength(6);
    expect(edges).toHaveLength(5);
    expect(
      nodes.some(
        (node) =>
          node.id === "entity-attr-composite: Dog|birthdate|day" &&
          node.type === "composite-attribute",
      ),
    ).toBe(true);

    expect(
      nodes.some(
        (node) =>
          node.id === "entity-attr-composite: Dog|birthdate|month" &&
          node.type === "composite-attribute",
      ),
    ).toBe(true);

    expect(
      nodes.some(
        (node) =>
          node.id === "entity-attr-composite: Dog|birthdate|year" &&
          node.type === "composite-attribute",
      ),
    ).toBe(true);

    expect(
      edges.some(
        (edge) => edge.id === "entity-attr-composite: Dog birthdate->day",
      ),
    ).toBe(true);

    expect(
      edges.some(
        (edge) => edge.id === "entity-attr-composite: Dog birthdate->month",
      ),
    ).toBe(true);

    expect(
      edges.some(
        (edge) => edge.id === "entity-attr-composite: Dog birthdate->year",
      ),
    ).toBe(true);
  });
});

const simpleERDoc = `
entity Human {
  h_id key
  age
  name
}
`;

const weakEntity = `
entity Human depends on Eats {
  h_id pkey
  fav_meal
}
`;

const compositeAttribute = `
entity Dog {
  id key
  birthdate: [day, month, year]
}
`;
