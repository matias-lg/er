import { Node, Edge } from "reactflow";
import { Relationship } from "../../ERDoc/types/parser/Relationship";

type RelationshipNode = Node<
  {
    label: string;
    hasDependant: boolean;
  },
  "relationship"
>;

type RelationshipAttributeNode = Node<
  {
    label: string;
  },
  "relationship-attribute"
>;

type CompositeAttributeNode = Node<{ label: string }, "composite-attribute">;

export const relationshipToReactflowElements = (
  relationship: Relationship,
  hasDependant: boolean,
): [
  (RelationshipNode | RelationshipAttributeNode | CompositeAttributeNode)[],
  Edge[],
] => {
  const relationshipNodes: (
    | RelationshipNode
    | RelationshipAttributeNode
    | CompositeAttributeNode
  )[] = [];
  const relationshipEdges: Edge[] = [];

  // relationships are identified by their name and attributes, so we need all this info to generate a unique ID.
  const relationshipID = `${
    relationship.name
  }$${relationship.participantEntities
    .map((part) => part.entityName)
    .sort()
    .join("$")}`;
  const relationshipIDprefixed = `relationship: ${relationshipID}`;

  relationshipNodes.push({
    id: `relationship: ${relationshipID}`,
    type: "relationship",
    data: { label: relationship.name, hasDependant },
    position: { x: 0, y: 0 },
  });

  // create a node and add an edge to each own attribute
  for (const attr of relationship.attributes) {
    const attrID = `relationship-attr: ${relationshipID}|${attr.name}`;
    relationshipNodes.push({
      id: attrID,
      type: "relationship-attribute",
      data: { label: attr.name },
      position: { x: 0, y: 0 },
    });

    relationshipEdges.push({
      id: `relationship-attr: ${relationshipID}->${attr.name}`,
      source: attrID,
      target: relationshipIDprefixed,
      type: "straight",
    });
  }

  for (const entity of relationship.participantEntities) {
    if (entity.isComposite) {
      // Add labeled edges for the roles
      entity.childParticipants.forEach((child) => {
        relationshipEdges.push({
          id: `relationship-part: ${relationshipID}->${entity.entityName}->${child.entityName}`,
          label: child.entityName,
          source: `entity: ${entity.entityName}`,
          target: relationshipIDprefixed,
          type: "straight",
        });
      });
    } else {
      relationshipEdges.push({
        id: `relationship-part: ${relationshipID}->${entity.entityName}`,
        source: `entity: ${entity.entityName}`,
        target: relationshipIDprefixed,
        type: "straight",
      });
    }
  }
  return [relationshipNodes, relationshipEdges];
};
