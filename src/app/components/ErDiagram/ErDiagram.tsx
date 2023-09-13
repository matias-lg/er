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
  EdgeTypes,
} from "reactflow";
import "reactflow/dist/style.css";
import { ER } from "../../../ERDoc/types/parser/ER";
import { entityToReactflowElements } from "../../util/entityToReactflowElements";
import { relationshipToReactflowElements } from "../../util/relationshipToReactflowElements";
import { updateGraphElementsWithAggregation } from "../../util/updateGraphElementsWithAggregation";
import ArrowNotation from "./notations/ArrowNotation";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { Tooltip } from "@chakra-ui/react";
import { useTranslations } from "next-intl";
import { ErNotation } from "../../types/ErNotation";

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
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          node = {
            ...originalAgg,
            ...node,
          };
          layoutedNodes.push({...node, position: {x: node.x, y: node.y}} as Node);
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
      console.log(layoutedNodes);

      setNodes(layoutedNodes as Node[]);
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
  erNodeTypes: NodeTypes;
  erEdgeTypes: EdgeTypes;
};

const NotationSelectorErDiagramWrapper = ({ erDoc }: { erDoc: ER }) => {
  const [currentNotation, _] = useState<ErNotation>(ArrowNotation);
  return (
    <ReactFlowProvider>
      <ErDiagram
        erDoc={erDoc}
        erNodeTypes={currentNotation.nodeTypes}
        erEdgeTypes={currentNotation.edgeTypes}
      />
    </ReactFlowProvider>
  );
};

const ErDiagram = ({ erDoc, erNodeTypes, erEdgeTypes }: ErDiagramProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { getLayoutedElements } = useLayoutedElements();
  const t = useTranslations("home.erDiagram");

  const nodeTypes = useMemo(() => erNodeTypes, []);
  const edgeTypes = useMemo(() => erEdgeTypes, []);

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
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];

    for (const entity of erDoc.entities) {
      const [newEntityNodes, newEntityEdges] =
        entityToReactflowElements(entity);
      newNodes.push(...newEntityNodes);
      newEdges.push(...newEntityEdges);
    }

    for (const rel of erDoc.relationships) {
      const [newRelNodes, newRelEdges] = relationshipToReactflowElements(
        rel,
        relationshipsWithDependants.some((r) => r.name === rel.name),
      );
      newNodes.push(...newRelNodes);
      newEdges.push(...newRelEdges);

      // Aggregations
      const foundAgg = erDoc.aggregations.find(
        (agg) => agg.aggregatedRelationshipName === rel.name,
      );
      const aggregatedRelationshipNodeId = newRelNodes.find(
        (n) => n.type === "relationship",
      )?.id;

      if (foundAgg !== undefined) {
        updateGraphElementsWithAggregation({
          nodes: newNodes,
          edges: newEdges,
          aggregationName: foundAgg.name,
          aggregatedRelationshipNodeId: aggregatedRelationshipNodeId!,
        });
      }
    }

    // if the node already exists, keep its position
    setNodes((nodes) => {
      for (const n of newNodes) {
        const oldNode = nodes.find((nd) => nd.id === n.id);
        if (oldNode !== undefined) {
          n.position = oldNode.position;
        }
      }
      return newNodes;
    });

    setEdges(newEdges);
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
      <Panel position="bottom-right">
        <div className="flex h-16 w-16 justify-center rounded-full border-2 border-black bg-primary p-3 text-secondary drop-shadow-xl">
          <button
            onClick={() => {
              void getLayoutedElements({
                "elk.algorithm": "org.eclipse.elk.stress",
                "elk.stress.desiredEdgeLength": "130",
                // "elk.nodeSize.constraints": "MINIMUM_SIZE",
              });
            }}
          >
            <Tooltip
              label={t("layoutButtonTooltip")}
              aria-label="stress layout"
            >
              <span>
                <FaWandMagicSparkles id="layout-button" size={"90%"} />
              </span>
            </Tooltip>
          </button>
        </div>
      </Panel>
      <Panel position="top-center">
        <br />
        <button
          onClick={() => {
            void getLayoutedElements({
              "elk.algorithm": "org.eclipse.elk.stress",
              "elk.stress.desiredEdgeLength": "110",
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
