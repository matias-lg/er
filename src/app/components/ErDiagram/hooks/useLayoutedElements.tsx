import ELK, { ElkExtendedEdge, ElkNode } from "elkjs/lib/elk.bundled.js";
import { useEffect } from "react";
import { Edge, Node, ReactFlowState, useReactFlow, useStore } from "reactflow";
import { LayoutedNode, updateNodePosition } from "../../../util/common";
import { AggregationNode, ErNode } from "../../../types/ErDiagram";
import { Layout } from "webcola";

type LayoutNode = Partial<
  ElkNode &
    ErNode & {
      isIsA: boolean;
      isAggregation: boolean;
      isRelationship: boolean;
      represents: string;
    }
>;

const defaultOptions = {
  "elk.algorithm": "org.eclipse.elk.force",
  "elk.force.temperature": "0.03",
  "elk.spacing.nodeNode": "1.1",
  "elk.force.iterations": "100",
};

const nodeCountSelector = (state: ReactFlowState) => state.nodeInternals.size;
const edgeCountSelector = (state: ReactFlowState) =>
  state.edges.filter((e) => !e.id.startsWith("ALIGN")).length;
const nodesInitializedSelector = (state: ReactFlowState) =>
  Array.from(state.nodeInternals.values()).every(
    (node) => node.width && node.height,
  );

const useLayoutedElements = (shouldLayout: boolean) => {
  const { getNodes, setNodes, getEdges, setEdges, fitView } = useReactFlow();
  const nodeCount = useStore(nodeCountSelector);
  const edgeCount = useStore(edgeCountSelector);
  const nodesInitialized = useStore(nodesInitializedSelector);

  useEffect(() => {
    if (!nodeCount || !nodesInitialized || !shouldLayout) {
      return;
    }
    const nodes = getNodes();
    const edges = getEdges();
    getLayoutedElements(nodes, edges).then((layoutedNodes) => {
      setNodes((nodes) =>
        nodes.map((node) => {
          const layoutedNode = layoutedNodes.find((n) => n.id === node.id);
          return {
            ...node,
            position: layoutedNode?.position!,
            style: { ...node.style, opacity: 1 },
          };
        }),
      );

      setEdges((edges) =>
        edges.map((edge) => ({
          ...edge,
          hidden: false,
          style: {
            ...edge.style,
          },
        })),
      );
      setTimeout(() => window.requestAnimationFrame(() => fitView()), 0);
    });
  }, [
    nodeCount,
    edgeCount,
    nodesInitialized,
    getNodes,
    getEdges,
    setNodes,
    setEdges,
    fitView,
    shouldLayout,
  ]);
};

const getLayoutedElements = async (
  flowNodes: Node[],
  flowEdges: Edge[],
  elkOptions: { [key: string]: string } = {},
) => {
  const elk = new ELK();
  const layoutOptions = { ...defaultOptions, ...elkOptions };

  const aggregationSubGraphOptions = {
    "elk.algorithm": "org.eclipse.elk.force",
    "elk.force.temperature": "0.03",
    "elk.spacing.nodeNode": "2.1",
    "elk.force.iterations": "80",
  };

  const subGraphOptions = {
    "elk.algorithm": "org.eclipse.elk.radial",
    // "org.eclipse.elk.radial.compactor": "WEDGE_COMPACTION",
  };

  const nodesWithChildren = flowNodes
    .map((n) => n.parentNode)
    .filter(Boolean)
    .map((parentId) => flowNodes.find((n) => n.id === parentId)!)
    // make sure we only have unique nodes
    .filter((node, index, self) => self.indexOf(node) === index);

  // create subgraphs for every node and its children
  const subGraphs = nodesWithChildren.map((parentNode) => {
    const subGraphNodes = flowNodes.filter(
      (n) => n.parentNode === parentNode.id,
    );

    // aggregations are not a node for ELK, but a subgraph
    if (parentNode.type !== "aggregation") subGraphNodes.push(parentNode);

    const childrenEdges = flowEdges.filter((e) => {
      return (
        subGraphNodes.some((n) => n.id === e.source) &&
        subGraphNodes.some((n) => n.id === e.target)
      );
    });

    return {
      id:
        parentNode.type === "aggregation"
          ? parentNode.id
          : "subgraph-" + parentNode.id,
      isAggregation: parentNode.type === "aggregation",
      isRelationship: parentNode.type === "relationship",
      represents: parentNode.id,
      layoutOptions:
        parentNode.type === "aggregation"
          ? aggregationSubGraphOptions
          : subGraphOptions,
      children: subGraphNodes,
      edges: childrenEdges,
    };
  });

  const notInSubGraphNodes = flowNodes.filter(
    (n) =>
      // is not in a subgraph
      subGraphs.every((sg) => sg.children.every((c) => c.id !== n.id)) &&
      // is not an aggregation node
      n.type !== "aggregation",
  );

  const notInSubGraphEdges = flowEdges.filter((edge) =>
    subGraphs.every((sg) => sg.edges.every((ed) => ed.id !== edge.id)),
  );

  // if an edge is connected to a subgraph child element we need to connect it to the subgraph instead
  notInSubGraphEdges.forEach((edge) => {
    subGraphs.forEach((subGraph) => {
      if (subGraph.children.some((c) => c.id === edge.source)) {
        edge.source = subGraph.id;
      }
      if (subGraph.children.some((c) => c.id === edge.target)) {
        edge.target = subGraph.id;
      }
    });
  });

  const allNodes = [...notInSubGraphNodes, ...subGraphs];

  // subgraphs will be inside another subgraph containing entities and isAs.
  const isA_subGraphs = findConnectedToIsA(
    // @ts-ignore
    allNodes,
    notInSubGraphEdges,
  );

  // @ts-ignore
  const finallyProcessedNodes = [
    ...isA_subGraphs,
    // @ts-ignore
    ...allNodes.filter((n) => n.considered === undefined),
  ];
  const notInIsA_subGraphEdges = notInSubGraphEdges.filter(
    // @ts-ignore
    (n) => n.considered === undefined,
  );

  // We have to do the same but now for the isAs...
  notInIsA_subGraphEdges.forEach((edge) => {
    finallyProcessedNodes.forEach((node) => {
      // @ts-ignore
      if (node.children) {
        // @ts-ignore
        if (node.children?.some((c) => c.id === edge.source)) {
          // @ts-ignore
          edge.source = node.id;
        }
        // @ts-ignore
        if (node.children.some((c) => c.id === edge.target)) {
          // @ts-ignore
          edge.target = node.id;
        }
      }
    });
  });

  const rootGraph = {
    id: "root",
    layoutOptions: layoutOptions,
    children: finallyProcessedNodes,
    // @ts-ignore
    edges: notInSubGraphEdges.filter((n) => n.considered === undefined),
  };
  debug(rootGraph);

  // layout nodes
  let layout = await elk.layout(rootGraph as unknown as ElkNode);

  const children = layout.children as unknown as LayoutNode[];
  const layoutedNodes: Node[] = [];

  children?.forEach((node) => {
    if (Object.prototype.hasOwnProperty.call(node, "children")) {
      layoutedNodes.push(...unwrapSubgraph(node, flowNodes, 0, 0));
    } else {
      layoutedNodes.push({
        ...node,
        position: { x: node.x!, y: node.y! },
      } as ErNode);
    }
  });

  return layoutedNodes;
};

export { getLayoutedElements, useLayoutedElements };

const debug = (graph: any): any => {
  const recur = (graph: any) => {
    const asElk = {
      id: graph.id,
      layoutOptions: graph.layoutOptions,
      children: graph.children.map((c: any) => {
        if (c.children) return recur(c);
        return {
          id: c.id,
          width: c.width,
          height: c.height,
        };
      }),
      edges: graph.edges.map((e: any) => ({
        id: e.id,
        source: e.source,
        target: e.target,
      })),
    };
    return asElk;
  };
  const str = JSON.stringify(recur(graph), null, 2);
  console.log("#####");
  console.log(str);
};

const BFS = (edges: Edge[], start: LayoutNode, nodes: LayoutNode[]) => {
  const visitedIds = new Set<string>();
  const visitedEdgeIds = new Set<string>();
  const queue: LayoutNode[] = [];
  queue.push(start);

  const connectedNodes: LayoutNode[] = [];

  while (queue.length > 0) {
    const currNode = queue.shift()!;
    if (visitedIds.has(currNode.id!)) continue;
    connectedNodes.push(currNode);
    visitedIds.add(currNode.id!);
    for (const edge of edges) {
      if (edge.source == currNode.id || edge.target == currNode.id) {
        let toPushNode: (typeof nodes)[0];
        const sourceNode = nodes.find((n) => n.id === edge.source)!;
        const targetNode = nodes.find((n) => n.id === edge.target)!;
        if (sourceNode.id === currNode.id) toPushNode = targetNode;
        else toPushNode = sourceNode;
        if (toPushNode.type === "relationship" || toPushNode.isRelationship)
          continue;
        visitedEdgeIds.add(edge.id);
        queue.push(toPushNode);
      }
    }
  }

  return [
    connectedNodes,
    edges.filter((e) => visitedEdgeIds.has(e.id)),
  ] as const;
};

// If there's nodes connected by an "IsA", group them into a subgraph.
const findConnectedToIsA = (nodes: LayoutNode[], edges: Edge[]) => {
  const isALayoutOptions = {
    "org.eclipse.elk.direction": "DOWN",
  };
  const visitedNodes = new Set<string>();
  const visitedEdges = new Set<string>();
  const subgraphs: LayoutNode[] = [];
  for (const node of nodes) {
    if (node.type === "isA" && !visitedNodes.has(node.id!)) {
      const [nods, eds] = BFS(edges, node, nodes);
      visitedNodes.add(node.id!);
      nods.forEach((n) => visitedNodes.add(n.id!));
      eds.forEach((e) => visitedEdges.add(e.id));
      subgraphs.push({
        id: "subgraph-isA-" + node.id,
        children: nods as ElkNode[],
        isAggregation: false,
        isIsA: true,
        represents: node.id,
        layoutOptions: isALayoutOptions,
        edges: eds as unknown as ElkExtendedEdge[],
      });
    }
  }

  for (const node of nodes) {
    // @ts-ignore
    if (visitedNodes.has(node.id!)) node.considered = true;
  }

  for (const edge of edges) {
    // @ts-ignore
    if (visitedEdges.has(edge.id)) edge.considered = true;
  }

  return subgraphs;
};

// transforms a subgraph back into reactflow nodes and edges
const unwrapSubgraph = (
  subgraph: LayoutNode,
  flowNodes: Node[],
  offsetX: number,
  offsetY: number,
): Node[] => {
  if (Object.prototype.hasOwnProperty.call(subgraph, "children")) {
    if (subgraph.isAggregation) {
      return unwrapAggregationSubgraph(subgraph, flowNodes, offsetX, offsetY);
    } else if (subgraph.isIsA) {
      return unwrapIsASubgraph(subgraph, flowNodes, offsetX, offsetY);
    } else return unwrapRegularSubgraph(subgraph, flowNodes, offsetX, offsetY);
  } else return [];
};

const unwrapIsASubgraph = (
  subgraph: LayoutNode,
  flowNodes: Node[],
  offsetX: number,
  offsetY: number,
) => {
  const layoutedNodes: Node[] = [];
  for (const child of subgraph.children!) {
    const x = subgraph.x! + offsetX;
    const y = subgraph.y! + offsetY;
    if (Object.prototype.hasOwnProperty.call(child, "children")) {
      layoutedNodes.push(...unwrapRegularSubgraph(child, flowNodes, x, y));
    } else {
      layoutedNodes.push({
        ...child,
        position: { x: x + child.x!, y: y + child.y! },
      } as ErNode);
    }
  }
  return layoutedNodes;
};

const unwrapRegularSubgraph = (
  subgraph: LayoutNode,
  flowNodes: Node[],
  offsetX: number,
  offsetY: number,
) => {
  const layoutedNodes: Node[] = [];
  const parent = subgraph.children?.find(
    (child) => child.id === subgraph.represents,
  );

  layoutedNodes.push(
    // @ts-ignore
    ...subgraph.children?.map(
      (childNode) =>
        positionRelativeToParent(
          childNode,
          subgraph.represents!,
          parent?.x!,
          parent?.y!,
          subgraph.x! + offsetX,
          subgraph.y! + offsetY,
        ) as ElkNode,
    ),
  );
  return layoutedNodes;
};

const unwrapAggregationSubgraph = (
  subgraph: LayoutNode,
  flowNodes: Node[],
  offsetX: number,
  offsetY: number,
) => {
  const layoutedNodes: Node[] = [];
  // if it is an aggregation, mutate the subgraph back into a regular node
  const originalAgg = flowNodes.find((fn) => fn.id === subgraph.id);
  subgraph = {
    ...originalAgg,
    ...subgraph,
  } as ElkNode;
  // we need to create a new instance of data to trigger a rerender
  subgraph.data = {
    // @ts-ignore
    erId: subgraph.data.erId as string,
    label: (subgraph as AggregationNode).data?.label,
    width: subgraph.width,
    height: subgraph.height,
  };
  const x = subgraph.x! + offsetX;
  const y = subgraph.y! + offsetY;

  layoutedNodes.push({
    ...subgraph,
    position: { x, y },
  } as ErNode);
  layoutedNodes.push(
    // @ts-ignore
    ...subgraph.children?.map(
      (childNode) =>
        positionRelativeToParent(
          childNode,
          "not_possible",
          0,
          0,
          x,
          y,
        ) as ElkNode,
    ),
  );
  return layoutedNodes;
};

const positionRelativeToParent = (
  node: LayoutNode,
  parentId: string,
  parentX: number,
  parentY: number,
  subgraphX: number,
  subgraphY: number,
): LayoutNode => {
  // adjust the position of the parent
  if (node.id === parentId) {
    return {
      ...node,
      position: { x: node.x! + subgraphX, y: node.y! + subgraphY },
    };
  } else {
    return {
      ...node,
      position: { x: node.x! - parentX, y: node.y! - parentY },
    };
  }
};
