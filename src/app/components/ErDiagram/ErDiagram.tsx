import ELK, { ElkNode } from "elkjs/lib/elk.bundled.js";
import { useCallback, useEffect, useMemo, useState } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  Edge,
  Node,
  NodeTypes,
  Panel,
  useReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { ER } from "../../../ERDoc/types/parser/ER";
import { entityToReactflowElements } from "../../util/entityToReactflowElements";
import { relationshipToReactflowElements } from "../../util/relationshipToReactflowElements";
import { updateGraphElementsWithAggregation } from "../../util/updateGraphElementsWithAggregation";
import ArrowNotation from "./notations/ArrowNotation";
import SimpleFloatingEdge from "./notations/SimpleFloatingEdge";

const elk = new ELK();

const useLayoutedElements = () => {
  const { getNodes, setNodes, getEdges, fitView } = useReactFlow();
  const defaultOptions = {
    "elk.algorithm": "layered",
    // "elk.layered.spacing.nodeNodeBetweenLayers": 50,
    // "elk.spacing.nodeNode": 100000,
  };

  const getLayoutedElements = useCallback(
    async (options: { [key: string]: string }) => {
      const layoutOptions = { ...defaultOptions, ...options };
      const graph = {
        id: "root",
        layoutOptions: layoutOptions,
        children: getNodes(),
        edges: getEdges(),
      };

      const { children, edges } = await elk.layout(graph as unknown as ElkNode);
      console.log(children);
      console.log(edges);
      // By mutating the children in-place we saves ourselves from creating a
      // needless copy of the nodes array.
      children?.forEach((node) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        node.position = { x: node.x, y: node.y };
      });

      setNodes(children as Node[]);
      window.requestAnimationFrame(() => {
        fitView();
      });
    },
    [],
  );

  return { getLayoutedElements };
};

type ErDiagramProps = {
  erDoc: ER;
  notation: NodeTypes;
};

const edgeTypes = {
  simple: SimpleFloatingEdge,
};

const NotationSelectorErDiagramWrapper = ({ erDoc }: { erDoc: ER }) => {
  const [currentNotation, _] = useState<NodeTypes>(ArrowNotation);
  return (
    <ReactFlowProvider>
      {" "}
      <ErDiagram erDoc={erDoc} notation={currentNotation} />{" "}
    </ReactFlowProvider>
  );
};

const ErDiagram = ({ erDoc, notation }: ErDiagramProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { getLayoutedElements } = useLayoutedElements();

  const nodeTypes = useMemo(() => notation, []);

  const relationshipsWithDependants = useMemo(() => {
    if (erDoc === null) return [];
    return erDoc.relationships.filter((rel) =>
      rel.participantEntities.some(
        (part) =>
          erDoc.entities.find((e) => e.name === part.entityName)?.dependsOn
            ?.relationshipName === rel.name,
      ),
    );
  }, [erDoc]);

  useEffect(() => {
    if (erDoc === null) return;
    const entityNodes: Node[] = [];
    const relationshipNodes: Node[] = [];
    const attributeNodes: Node<{
      label: string;
      isKey: boolean;
      entityIsWeak: boolean;
    }>[] = [];

    const attributeEdges: Edge[] = [];
    const relationshipEdges: Edge[] = [];

    for (const entity of erDoc.entities) {
      const [newEntityNodes, newEntityEdges] =
        entityToReactflowElements(entity);
      entityNodes.push(...newEntityNodes);
      attributeEdges.push(...newEntityEdges);
    }

    for (const rel of erDoc.relationships) {
      const [newRelNodes, newRelEdges] = relationshipToReactflowElements(
        rel,
        relationshipsWithDependants.some((r) => r.name === rel.name),
      );
      relationshipNodes.push(...newRelNodes);
      relationshipEdges.push(...newRelEdges);

      // Aggregations
      const foundAgg = erDoc.aggregations.find(
        (agg) => agg.aggregatedRelationshipName === rel.name,
      );
      const aggregatedRelationshipNodeId = newRelNodes.find(
        (n) => n.type === "relationship",
      )?.id;

      if (foundAgg !== undefined) {
        updateGraphElementsWithAggregation({
          entityNodes,
          attributeNodes,
          relationshipNodes,
          attributeEdges,
          relationshipEdges,
          aggregationName: foundAgg.name,
          aggregatedRelationshipNodeId: aggregatedRelationshipNodeId!,
        });
      }
    }

    // if the node already exists, keep its position
    setNodes((nodes) => {
      const newNodes = [
        ...entityNodes,
        ...relationshipNodes,
        ...attributeNodes,
      ];
      for (const n of newNodes) {
        const oldNode = nodes.find((nd) => nd.id === n.id);
        if (oldNode !== undefined) {
          n.position = oldNode.position;
        }
      }
      return newNodes;
    });

    setEdges([...relationshipEdges, ...attributeEdges]);
  }, [erDoc]);

  return (
    <ReactFlow
      nodes={nodes}
      onNodesChange={onNodesChange}
      nodeTypes={nodeTypes}
      edges={edges}
      onEdgesChange={onEdgesChange}
      edgeTypes={edgeTypes}
      proOptions={{ hideAttribution: true }}
    >
      <Background variant={BackgroundVariant.Cross} />
      <Panel position="top-center">
        <br />
        <button
          onClick={() => {
            void getLayoutedElements({
              "elk.algorithm": "org.eclipse.elk.stress",
              "elk.stress.desiredEdgeLength": "150",
            });
          }}
        >
          stress layout
        </button>
        <br />
        <button
          onClick={() => {
            void getLayoutedElements({
              "elk.algorithm": "org.eclipse.elk.radial",
              "elk.portLabels.placement": "ALWAYS_SAME_SIDE",
            });
          }}
        >
          radial layout
        </button>

        <br />
        <button
          onClick={() => {
            void getLayoutedElements({
              "elk.algorithm": "org.eclipse.elk.force",
            });
          }}
        >
          force layout
        </button>
      </Panel>

      <Controls />
    </ReactFlow>
  );
};

export { NotationSelectorErDiagramWrapper as ErDiagram };
