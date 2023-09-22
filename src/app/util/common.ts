import { Node } from "reactflow";

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
