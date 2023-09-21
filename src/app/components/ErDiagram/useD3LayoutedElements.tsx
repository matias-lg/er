import { useCallback } from "react";
import { useStore, useReactFlow } from "reactflow";
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceX,
  forceY,
} from "d3-force";

const simulation = forceSimulation()
  .force("charge", forceManyBody().strength(-500))
  .force("x", forceX().x(0).strength(0.05))
  .force("y", forceY().y(0).strength(0.05))
  .alphaTarget(0.05)
  .stop();

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
      x: node.position.x,
      y: node.position.y,
    }));
    const edges = getEdges();

    // If React Flow hasn't initialised our nodes with a width and height yet, or
    // if there are no nodes in the flow, then we can't run the simulation!
    if (!initialised || nodes.length === 0) return;

    simulation.nodes(nodes).force(
      "link",
      forceLink(edges)
        .id((d) => d.id)
        .strength(0.05)
        .distance(100),
    );

    simulation.tick(1000);
    setNodes(
      nodes.map((node) => ({ ...node, position: { x: node.x, y: node.y } })),
    );
    window.requestAnimationFrame(() => fitView());
  }, [initialised]);
  return { D3LayoutElements };
};
