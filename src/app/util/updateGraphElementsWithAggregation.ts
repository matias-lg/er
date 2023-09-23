import { Edge } from "reactflow";
import { createEntityNodeId } from "./common";
import { ErNode } from "../types/ErDiagram";

type Args = {
  nodes: ErNode[];
  edges: Edge[];
  aggregationName: string;
  aggregatedRelationshipNodeId: string;
};

export const updateGraphElementsWithAggregation = ({
  nodes,
  edges,
  aggregationName,
  aggregatedRelationshipNodeId,
}: Args) => {
  const aggregationNodeId = createEntityNodeId(aggregationName);
  // BFS to find all nodes that are connected to the aggregated relationship node
  const visited = new Set<string>();
  const queue = [aggregatedRelationshipNodeId];
  while (queue.length > 0) {
    const nodeId = queue.shift()!;
    if (visited.has(nodeId)) continue;
    visited.add(nodeId);
    for (const edge of edges) {
      if (edge.source == nodeId || edge.target == nodeId) {
        if (
          /* avoid other relationship nodes */
          (edge.source.startsWith("relationship:") &&
            edge.source != aggregatedRelationshipNodeId) ||
          (edge.target.startsWith("relationship:") &&
            edge.target != aggregatedRelationshipNodeId)
        )
          continue;
        queue.push(edge.target == nodeId ? edge.source : edge.target);
      }
    }
  }

  nodes.forEach((node) => {
    if (visited.has(node.id)) {
      node.zIndex = 10;
      node.extent = "parent";
      node.parentNode = aggregationNodeId;
    }
  });

  nodes.push({
    id: aggregationNodeId,
    type: "aggregation",
    data: {
      label: aggregationName,
    },
    position: { x: 0, y: 0 },
  });
};
