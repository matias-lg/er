import { Node } from "reactflow";
import { Relationship } from "../../ERDoc/types/parser/Relationship";

export const createRelationshipId = (relationship: Relationship): string => {
  // relationships are identified by their name and attributes, so we need all this info to generate a unique ID.
  return `${relationship.name}$${relationship.participantEntities
    .map((part) => part.entityName)
    .sort()
    .join("$")}`;
};

export const createEntityNodeId = (entityName: string): string => {
  return `entity: ${entityName}`;
};

export const createRelationshipNodeId = (relationshipId: string): string => {
  return `relationship: ${relationshipId}`;
};

export type LayoutedNode = Node & { x: number; y: number };

export const adjustChildNodePosition = (
  node: LayoutedNode,
  nodes: LayoutedNode[],
): LayoutedNode => {
  if (
    // if the node is an attribute, we need to update its position relative to its parent
    [
      "composite-attribute",
      "entity-attribute",
      "relationship-attribute",
    ].includes(node.type!)
  ) {
    const parentNode = nodes.find((n) => n.id === node.parentNode);
    if (parentNode && parentNode.type !== "aggregation") {
      node.x = node.x - parentNode.x;
      node.y = node.y - parentNode.y;
    }
  }
  return { ...node, position: { x: node.x, y: node.y } };
};
