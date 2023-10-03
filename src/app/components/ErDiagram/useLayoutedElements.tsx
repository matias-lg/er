import { useCallback } from "react";
import { useReactFlow, Node, Edge } from "reactflow";
import ELK, { ElkNode } from "elkjs/lib/elk.bundled.js";
import { adjustChildNodePosition } from "../../util/common";
import { LayoutedNode } from "../../util/common";

const elk = new ELK();
const defaultOptions = {
  "elk.algorithm": "org.eclipse.elk.force",
  "elk.force.temperature": "0.05",
  "elk.spacing.nodeNode": "4.5",
  "elk.force.iterations": "1500",
};

const useLayoutedElements = () => {
  const { getNodes, setNodes, getEdges, fitView } = useReactFlow();

  const layoutElements = useCallback(
    async (elkOptions: { [key: string]: string } = {}) => {
      const nodes = getNodes();
      const edges = getEdges();
      const layoutedNodes = await getLayoutedElements(nodes, edges, elkOptions);
      setNodes(layoutedNodes);
      window.requestAnimationFrame(() => fitView());
    },
    [],
  );

  return { layoutElements };
};

const getLayoutedElements = async (
  flowNodes: Node[],
  flowEdges: Edge[],
  elkOptions: { [key: string]: string } = {},
) => {
  const layoutOptions = { ...defaultOptions, ...elkOptions };

  const aggregationNodeIds = flowNodes
    .filter((n) => n.type === "aggregation")
    .map((n) => n.id);

  // aggregations are treated as an ELK subgraph
  const aggregationGraphs = aggregationNodeIds.map((aggNodeId) => {
    const childrenNodes = flowNodes.filter((n) => n.parentNode === aggNodeId);
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
    // if it is an aggregation, mutate the subgraph back into a regular node
    if (Object.prototype.hasOwnProperty.call(node, "children")) {
      const originalAgg = flowNodes.find((fn) => fn.id === node.id);
      node = {
        ...originalAgg,
        ...node,
      } as ElkNode;
      // we need to create a new instance of data to trigger a rerender
      (node as Node).data = {
        label: (node as Node<{ label: string }>).data.label,
        width: node.width,
        height: node.height,
      };
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
      layoutedNodes.push(
        adjustChildNodePosition(
          node as LayoutedNode,
          children as LayoutedNode[],
        ),
      );
    }
  });
  return layoutedNodes;
};

export { useLayoutedElements, getLayoutedElements };
