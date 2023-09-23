import { useCallback } from "react";
import { useStore, useReactFlow, Edge } from "reactflow";
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceX,
  forceY,
} from "d3-force";
import { adjustChildNodePosition } from "../../util/common";

export const useD3LayoutedElements = () => {
  const { getNodes, setNodes, getEdges, fitView } = useReactFlow();

  const initialised = useStore((store) =>
    [...store.nodeInternals.values()].every(
      (node) => node.width && node.height,
    ),
  );

  const D3LayoutElements = useCallback((): void => {
    const nodes = getNodes().map((node) => ({
      ...node,
      x: 0,
      y: 0,
    }));
    const edges = getEdges();

    // ensure reactflow has initialised nodes
    if (!initialised || nodes.length === 0) return;

    forceSimulation()
      .stop()
      .force("charge", forceManyBody().strength(-500))
      .force("x", forceX().x(0).strength(0.05))
      .force("y", forceY().y(0).strength(0.05))
      .alphaTarget(0.05)
      .nodes(nodes)
      .force(
        "link",
        forceLink(edges)
          .id((d) => (d as Edge).id)
          .strength(0.05)
          .distance(100),
      )
      .tick(5500);

    setNodes(nodes.map((node) => adjustChildNodePosition(node, nodes)));
    window.requestAnimationFrame(() => fitView());
  }, [initialised]);
  return { D3LayoutElements };
};
