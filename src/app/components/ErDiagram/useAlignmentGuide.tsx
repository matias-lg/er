import { useRef } from "react";
import { Edge, Node, NodeDragHandler, useReactFlow } from "reactflow";

const EPSILON = 0.4;

// calculates the center point of the node from position and dimensions
const nodeCenter = (node: Node) => {
  return {
    centerX: node.position.x + node.width! / 2,
    centerY: node.position.y + node.height! / 2,
  };
};

// removes all alignment-guide edges from the list of edges
const removeGuideEdges = (edges: Edge[]) =>
  edges.filter((e) => !e.id.startsWith("ALIGN"));

// finds all nodes with their center aligned with the given x or y coordinate
const findAlignedNodes = (
  x: number,
  y: number,
  nodes: Node[],
): ["x" | "y", Node][] => {
  const alignedNodes: ["x" | "y", Node][] = [];

  for (const node of nodes) {
    const { centerX, centerY } = nodeCenter(node);
    if (Math.abs(x - centerX) < EPSILON) alignedNodes.push(["x", node]);
    else if (Math.abs(y - centerY) < EPSILON) alignedNodes.push(["y", node]);
  }

  return alignedNodes;
};

export const useAlignmentGuide = () => {
  const { getNodes, setEdges } = useReactFlow();
  const nodes = getNodes();

  // this ref stores the current dragged node
  const dragRef = useRef<Node | null>(null);

  const onNodeDragStart: NodeDragHandler = (_evt, node) => {
    dragRef.current = node;
  };

  const onNodeDrag: NodeDragHandler = (_evt, node) => {
    let { centerX, centerY } = nodeCenter(node);

    if (node.parentNode) {
      const parent = nodes.find((p) => p.id === node.parentNode);
      if (parent) {
        centerX += parent.position.x;
        centerY += parent.position.y;
      }
    }

    const absolutePositionNodes = nodes.map((n) => {
      const pos = { x: n.position.x, y: n.position.y };
      if (n.parentNode) {
        const parent = nodes.find((p) => p.id === n.parentNode);
        if (parent) {
          pos.x += parent.position.x;
          pos.y += parent.position.y;
        }
      }
      return { ...n, position: pos };
    });

    const alignedNodes = findAlignedNodes(
      centerX,
      centerY,
      absolutePositionNodes,
    );

    const alignmentGuideEdges = alignedNodes.map(([alignDir, n]) => {
      let sourceHandle = "l";
      let targetHandle = "r";

      if (alignDir === "y") {
        if (centerX < n.position.x) {
          sourceHandle = "l";
          targetHandle = "r";
        }
      } else if (alignDir === "x") {
        if (centerY < n.position.y) {
          sourceHandle = "b";
          targetHandle = "t";
        } else {
          sourceHandle = "t";
          targetHandle = "b";
        }
      }

      return {
        // TODO: Remove Math.random() in prod. Hooks run twice in strict mode.
        id: `ALIGN: ${node.id}-${n.id} ${Math.random()}`,
        source: node.id,
        target: n.id,
        sourceHandle,
        targetHandle,
        style: { stroke: "red" },
        type: "straight",
        animated: true,
      } as Edge;
    });

    setEdges((edges) => {
      // remove old alignment guides
      const noGuidesEdges = removeGuideEdges(edges);
      // add the new alignment guides
      return [...noGuidesEdges, ...alignmentGuideEdges];
    });
  };

  const onNodeDragStop: NodeDragHandler = (_evt, _node) => {
    setEdges((edges) => removeGuideEdges(edges));
    dragRef.current = null;
  };

  return { onNodeDragStart, onNodeDrag, onNodeDragStop };
};
