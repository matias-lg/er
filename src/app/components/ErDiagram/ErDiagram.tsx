import { useEffect, useMemo, useRef, useState } from "react";
import ReactFlow, {
  Edge,
  Node,
  NodeTypes,
  Panel,
  useReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  EdgeTypes,
  ReactFlowInstance,
} from "reactflow";
import "reactflow/dist/style.css";
import { ER } from "../../../ERDoc/types/parser/ER";
import { entityToReactflowElements } from "../../util/entityToReactflowElements";
import { relationshipToReactflowElements } from "../../util/relationshipToReactflowElements";
import { updateGraphElementsWithAggregation } from "../../util/updateGraphElementsWithAggregation";
import ArrowNotation from "./notations/ArrowNotation";
import { ErNode, ErNotation } from "../../types/ErDiagram";
import {
  useLayoutedElements,
  getLayoutedElements,
} from "./useLayoutedElements";
import CustomSVGs from "./CustomSVGs";
import { useD3LayoutedElements } from "./useD3LayoutedElements";
import { ControlPanel } from "./ControlPanel";

type ErDiagramProps = {
  erDoc: ER;
  erNodeTypes: NodeTypes;
  erEdgeTypes: EdgeTypes;
  erEdgeNotation: ErNotation["edgeMarkers"];
};

const NotationSelectorErDiagramWrapper = ({ erDoc }: { erDoc: ER }) => {
  const [currentNotation, _] = useState<ErNotation>(ArrowNotation);
  return (
    <ReactFlowProvider>
      <ErDiagram
        erDoc={erDoc}
        erNodeTypes={currentNotation.nodeTypes}
        erEdgeTypes={currentNotation.edgeTypes}
        erEdgeNotation={currentNotation.edgeMarkers}
      />
    </ReactFlowProvider>
  );
};

const ErDiagram = ({
  erDoc,
  erNodeTypes,
  erEdgeTypes,
  erEdgeNotation,
}: ErDiagramProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const { layoutElements } = useLayoutedElements();
  const { D3LayoutElements } = useD3LayoutedElements();

  const nodeTypes = useMemo(() => erNodeTypes, []);
  const edgeTypes = useMemo(() => erEdgeTypes, []);

  const isFirstRenderRef = useRef<boolean | null>(true);
  const reactFlowRef = useRef<ReactFlowInstance | null>(null);
  const { fitView } = useReactFlow();

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
    const newNodes: ErNode[] = [];
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
        erEdgeNotation,
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

    setNodes((nodes) => {
      for (const n of newNodes) {
        const oldNode = nodes.find((nd) => nd.id === n.id) as Node<{
          height: number;
          width: number;
        }>;
        // hack: on first render, hide the nodes before they are layouted
        if (isFirstRenderRef.current === true) {
          n.style = {
            ...n.style,
            opacity: 0,
          };
        }
        // if the node already exists, keep its position
        if (oldNode !== undefined) {
          n.position = oldNode.position;
          // for aggregations, don't modify its size
          if (oldNode.type === "aggregation" && n.type === "aggregation") {
            n.data.height = oldNode.data.height;
            n.data.width = oldNode.data.width;
          }
        }
      }
      return newNodes;
    });

    setEdges(() => {
      // same hack as above
      if (isFirstRenderRef.current === true) {
        return newEdges.map((e) => {
          e.hidden = true;
          return e;
        });
      } else return newEdges;
    });
  }, [erDoc]);

  /* auto layout on initial render */
  useEffect(() => {
    if (
      isFirstRenderRef.current === true &&
      nodes.length > 0 &&
      nodes?.[0]?.width != null
    ) {
      const updateElements = async () => {
        const layoutedElements = await getLayoutedElements(nodes, edges);
        setNodes(
          layoutedElements.map((n) => ({
            ...n,
            style: {
              ...n.style,
              opacity: 1,
            },
          })),
        );
        setEdges((eds) =>
          eds.map((e) => {
            e.hidden = false;
            return e;
          }),
        );
        fitView();
        isFirstRenderRef.current = false;
      };
      void updateElements();
    } else if (isFirstRenderRef.current === false) {
      reactFlowRef?.current?.fitView();
      isFirstRenderRef.current = null;
    }
  }, [nodes, edges]);

  return (
    <ReactFlow
      nodes={nodes}
      onNodesChange={onNodesChange}
      nodeTypes={nodeTypes}
      edges={edges}
      onEdgesChange={onEdgesChange}
      edgeTypes={edgeTypes}
      onInit={(rf) => {
        reactFlowRef.current = rf;
      }}
      proOptions={{ hideAttribution: true }}
    >
      {/* <Background variant={BackgroundVariant.Cross} /> */}

      <Panel position="top-right">
        <br />
        <button
          onClick={() => {
            void layoutElements({
              "elk.algorithm": "org.eclipse.elk.stress",
              "elk.stress.desiredEdgeLength": "110",
            });
          }}
        >
          ELK stress layout
        </button>
        <br />
        <button
          onClick={() => {
            void layoutElements({
              "elk.algorithm": "org.eclipse.elk.radial",
              "elk.portLabels.placement": "ALWAYS_SAME_SIDE",
            });
          }}
        >
          ELK radial layout
        </button>

        <br />
        <button
          onClick={() => {
            void layoutElements({
              "elk.algorithm": "org.eclipse.elk.force",
            });
          }}
        >
          ELK force layout
        </button>

        <br />
        <button onClick={D3LayoutElements}>d3-force Layout</button>
      </Panel>

      <ControlPanel />
      <CustomSVGs />
    </ReactFlow>
  );
};

export { NotationSelectorErDiagramWrapper as ErDiagram };
