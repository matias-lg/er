import { useCallback } from "react";
import { useReactFlow, Node } from "reactflow";
import ELK, { ElkNode } from "elkjs/lib/elk.bundled.js";

const elk = new ELK();
const useLayoutedElements = () => {
  const { getNodes, setNodes, getEdges, fitView } = useReactFlow();
  const defaultOptions = {};

  const getLayoutedElements = useCallback(
    async (options: { [key: string]: string }) => {
      const layoutOptions = { ...defaultOptions, ...options };
      const flowNodes = getNodes();
      const flowEdges = getEdges();

      const aggregationNodeIds = flowNodes
        .filter((n) => n.type === "aggregation")
        .map((n) => n.id);

      // aggregations are treated as an ELK subgraph
      const aggregationGraphs = aggregationNodeIds.map((aggNodeId) => {
        const childrenNodes = flowNodes.filter(
          (n) => n.parentNode === aggNodeId,
        );
        const childrenEdges = flowEdges.filter((e) => {
          return (
            childrenNodes.some((n) => n.id === e.source) &&
            childrenNodes.some((n) => n.id === e.target)
          );
        });

        return {
          id: aggNodeId,
          layoutOptions: layoutOptions,
          children: childrenNodes,
          edges: childrenEdges,
        };
      });

      const notInAggregationNodes = flowNodes.filter(
        (n) =>
          // is not a child of an aggregation subgraph
          aggregationGraphs.every((agg) =>
            agg.children.every((c) => c.id !== n.id),
          ) &&
          // is not an aggregation node
          n.type !== "aggregation",
      );

      const notInAggregationEdges = flowEdges.filter((edge) =>
        aggregationGraphs.every((agg) =>
          agg.edges.every((aggEd) => aggEd.id !== edge.id),
        ),
      );

      const graph = {
        id: "root",
        layoutOptions: layoutOptions,
        children: [...notInAggregationNodes, ...aggregationGraphs],
        edges: notInAggregationEdges,
      };

      const { children } = await elk.layout(graph as unknown as ElkNode);
      const layoutedNodes: Node[] = [];

      children?.forEach((node) => {
        if (node.hasOwnProperty("children")) {
          // mutate the aggregation subgraph back into a regular node
          const originalAgg = flowNodes.find((fn) => fn.id === node.id);
          node = {
            ...originalAgg,
            ...node,
          } as ElkNode;
          // we need to create a new instance of data to trigger a rerender
          (node as Node).data = { label: (node as Node).data.label, width: node.width, height: node.height}
          layoutedNodes.push({
            ...node,
            position: { x: node.x, y: node.y },
          } as Node);
          // and bring the aggregation child nodes to the main graph
          node.children?.forEach((childNode) => {
            layoutedNodes.push({
              ...childNode,
              position: { x: childNode.x!, y: childNode.y! },
            } as Node);
          });
        } else {
          layoutedNodes.push({
            ...node,
            position: { x: node.x!, y: node.y! },
          } as Node);
        }
      });

      setNodes(layoutedNodes as Node[]);
      window.requestAnimationFrame(() => {
        fitView();
      });
    },
    [],
  );

  return { getLayoutedElements };
};

export default useLayoutedElements;
