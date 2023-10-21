import ELK, { ElkNode } from "elkjs/lib/elk.bundled.js";
import { useEffect } from "react";
import { Edge, Node, ReactFlowState, useReactFlow, useStore } from "reactflow";
import { LayoutedNode, updateNodePosition } from "../../../util/common";

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
  const subGraphOptions = {
    ...layoutOptions,
    "elk.algorithm": "org.eclipse.elk.radial",
    // "org.eclipse.elk.radial.centerOnRoot": "true",
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
      represents: parentNode.id,
      layoutOptions:
        parentNode.type === "aggregation" ? layoutOptions : subGraphOptions,
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

  const graph = {
    id: "root",
    layoutOptions: layoutOptions,
    children: [...notInSubGraphNodes, ...subGraphs],
    edges: notInSubGraphEdges,
  };
  debug(graph);

  // layout nodes
  let layout = await elk.layout(graph as unknown as ElkNode);

  const children = layout.children;
  const layoutedNodes: Node[] = [];

  children?.forEach((node) => {
    if (Object.prototype.hasOwnProperty.call(node, "children")) {
      if (node.isAggregation) {
        // if it is an aggregation, mutate the subgraph back into a regular node
        const originalAgg = flowNodes.find((fn) => fn.id === node.id);
        node = {
          ...originalAgg,
          ...node,
        } as ElkNode;
        // we need to create a new instance of data to trigger a rerender
        (node as Node).data = {
          // @ts-ignore
          erId: node.data.erId,
          label: (node as Node<{ label: string }>).data.label,
          width: node.width,
          height: node.height,
        };
        layoutedNodes.push({
          ...node,
          position: { x: node.x, y: node.y },
        } as Node);
      }

      // adjust the position of the parent
      let originalParentPos: { x: number; y: number } = { x: 0, y: 0 };
      let parentName = "";

      //console.log(node);
      for (const childNode of node.children!) {
        const position = { x: childNode.x!, y: childNode.y! };
        if (childNode.id === node.represents) {
          originalParentPos.x = childNode.x!;
          originalParentPos.y = childNode.y!;
          parentName = childNode.data.erId;
          position.x += node.x!;
          position.y += node.y!;
          layoutedNodes.push({
            ...childNode,
            position,
          } as Node);
          break;
        }
      }

      // position the children relative to the parent
      node.children?.forEach((childNode) => {
        let { x: px, y: py } = originalParentPos;
        let cx = childNode.x!;
        let cy = childNode.y!;

        if (childNode.parentNode) {
          cx -= px;
          cy -= py;

          layoutedNodes.push({
            ...childNode,
            position: { x: cx, y: cy },
          } as Node);
        }
      });
    } else {
      layoutedNodes.push(
        updateNodePosition(
          node as LayoutedNode,
          children as LayoutedNode[],
          true,
        ),
      );
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
