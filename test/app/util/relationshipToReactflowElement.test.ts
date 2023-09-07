import { getERDoc } from "../../../src/ERDoc";
import { relationshipToReactflowElements } from "../../../src/app/util/relationshipToReactflowElements";

const getRelationshipFromERDoc = (erDoc: string, relationshipName: string) => {
  const [er, _] = getERDoc(erDoc);
  return er.relationships.find(
    (relationship) => relationship.name === relationshipName,
  );
};

// TODO: EDGE TYPES. VERY IMPORTANT.
describe("Convert a relationship to ReactFlow Nodes and Edges", () => {
  it("should convert a simple relationship", () => {
    const simpleRelationship = `
      relation Owns(Human, Arrow 1!)
    `;
    const relationship = getRelationshipFromERDoc(simpleRelationship, "Owns")!;
    const [nodes, edges] = relationshipToReactflowElements(relationship, false);
    expect(nodes).toHaveLength(1);
    expect(edges).toHaveLength(2);

    expect(
      nodes.some((node) => node.id === "relationship: Owns$Arrow$Human"),
    ).toBe(true);

    expect(
      edges.some(
        (edge) =>
          edge.id === "relationship-part: Owns$Arrow$Human->Human" &&
          edge.target === "relationship: Owns$Arrow$Human" &&
          edge.source === "entity: Human",
      ),
    ).toBe(true);

    expect(
      edges.some(
        (edge) =>
          edge.id === "relationship-part: Owns$Arrow$Human->Arrow" &&
          edge.target === "relationship: Owns$Arrow$Human" &&
          edge.source === "entity: Arrow",
      ),
    ).toBe(true);
  });

  it("should convert a relationship with attributes", () => {
    const relationshipWithAttributes = `
      relation Owns(Human, House 1!) {
        since
      }
    `;

    const relationship = getRelationshipFromERDoc(
      relationshipWithAttributes,
      "Owns",
    )!;

    const [nodes, edges] = relationshipToReactflowElements(relationship, false);
    expect(nodes).toHaveLength(2);
    expect(edges).toHaveLength(3);
    expect(
      nodes.some(
        (node) =>
          node.type === "relationship-attribute" &&
          node.id === "relationship-attr: Owns$House$Human|since",
      ),
    ).toBe(true);
    expect(
      edges.some(
        (edge) => edge.id === "relationship-attr: Owns$House$Human->since",
      ),
    ).toBe(true);
  });

  it("should convert a relationship with a weak participant", () => {
    // somewhere else in the ERDOC should be "entity House depends on Owns...", but we pass it as an argument
    const relationshipWithWeakParticipant = `
      relation Owns(Human, House 1!)
    `;
    const relationship = getRelationshipFromERDoc(
      relationshipWithWeakParticipant,
      "Owns",
    )!;
    const [nodes, _] = relationshipToReactflowElements(relationship, true);
    expect(nodes).toHaveLength(1);
    expect(nodes[0].type === "relationship" && nodes[0].data.hasDependant).toBe(
      true,
    );
  });

  it("should convert a relationship with a composite participant", () => {
    const relationshipWithCompositeParticipant = `
      relation Owns(Human: [Alice, Bob], House 1!)
    `;
    const relationship = getRelationshipFromERDoc(
      relationshipWithCompositeParticipant,
      "Owns",
    )!;
    const [nodes, edges] = relationshipToReactflowElements(relationship, false);
    expect(nodes).toHaveLength(1);
    expect(edges).toHaveLength(3);
    expect(
      edges.some(
        (edge) =>
          edge.id === "relationship-part: Owns$House$Human->Human->Alice",
      ),
    ).toBe(true);

    expect(
      edges.some(
        (edge) => edge.id === "relationship-part: Owns$House$Human->Human->Bob",
      ),
    ).toBe(true);
  });
});
