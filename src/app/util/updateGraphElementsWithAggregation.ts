import { Node, Edge } from "reactflow";

type Args = {
  entityNodes: Node[];
  attributeNodes: Node[];
  relationshipNodes: Node[];
  attributeEdges: Edge[];
  relationshipEdges: Edge[];
  aggregationName: string;
  aggregatedRelationshipNodeId: string;
};

export const updateGraphElementsWithAggregation = ({
  entityNodes,
  attributeNodes,
  relationshipNodes,
  attributeEdges,
  relationshipEdges,
  aggregationName,
  aggregatedRelationshipNodeId,
}: Args) => {
  const aggregationNodeId = `entity: ${aggregationName}`;
  // BFS to find all nodes that are connected to the aggregated relationship node
  const visited = new Set<string>();
  const queue = [aggregatedRelationshipNodeId];
  const eds = [...attributeEdges, ...relationshipEdges];
  while (queue.length > 0) {
    const nodeId = queue.shift()!;
    if (visited.has(nodeId)) continue;
    visited.add(nodeId);
    for (const edge of eds) {
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

  [entityNodes, attributeNodes, relationshipNodes].forEach((nodes) => {
    nodes.forEach((node) => {
      if (visited.has(node.id)) {
        node.zIndex = 10;
        node.parentNode = aggregationNodeId;
      }
    });
  });
  entityNodes.push({
    id: aggregationNodeId,
    type: "aggregation",
    data: {
      label: aggregationName,
    },
    position: { x: 0, y: 0 },
  });
};
