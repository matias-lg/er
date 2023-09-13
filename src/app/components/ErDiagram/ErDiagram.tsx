import { useEffect, useMemo, useState } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  Edge,
  Node,
  NodeTypes,
  Panel,
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
import useLayoutedElements from "./useLayoutedElements";

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
        // if the node already exists, keep its position
        if (oldNode !== undefined) {
          n.position = oldNode.position;
          // for aggregations, don't modify its size
          if (oldNode.type === "aggregation") {
            (n as Node<{ height: number }>).data.height = oldNode.data.height;
            (n as Node<{ width: number }>).data.width = oldNode.data.width;
          }
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
