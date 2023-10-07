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

export const updateNodePosition = (
  node: LayoutedNode,
  nodes: LayoutedNode[],
  adjustAnchor: boolean = false,
): LayoutedNode => {
  if (adjustAnchor) {
    node.x -= node.width! / 2;
    node.y -= node.height! / 2;
  }
  const parentNode = nodes.find((n) => n.id === node.parentNode);
  if (parentNode) {
    node.x = node.x - parentNode.x;
    node.y = node.y - parentNode.y;
  }
  return { ...node, position: { x: node.x, y: node.y } };
};

const HANDLE_PREFIXES = ["1", "2", "3", "4"] as const;
export const getHandlePrefix = (edgeId: string) => {
  let handlePrefix = "";
  if (HANDLE_PREFIXES.find((prefix) => prefix === edgeId[0])) {
    handlePrefix = edgeId[0];
  }
  return handlePrefix;
};
