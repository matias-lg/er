import { useEffect, useMemo, useRef, useState } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Node,
  Panel,
  ReactFlowProvider,
  useEdgesState,
  useNodesInitialized,
  useNodesState,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import { ER } from "../../../ERDoc/types/parser/ER";
import { erToReactflowElements } from "../../util/erToReactflowElements";
import { ControlPanel } from "./ControlPanel";
import CustomSVGs from "./CustomSVGs";
import { NotationPicker } from "./NotationPicker";
import ArrowNotation from "./notations/ArrowNotation/ArrowNotation";
import ErNotation from "./notations/DefaultNotation";
import { useD3LayoutedElements } from "./useD3LayoutedElements";
import { useColaLayoutedElements } from "./useColaLayoutedElements";
import {
  getLayoutedElements,
  useLayoutedElements,
} from "./useLayoutedElements";

type ErDiagramProps = {
  erDoc: ER;
  notation: ErNotation;
  onErEdgeNotationChange: (newNotation: ErNotation) => void;
  erEdgeNotation: ErNotation["edgeMarkers"];
};

const initialNotation = new ArrowNotation();

const NotationSelectorErDiagramWrapper = ({ erDoc }: { erDoc: ER }) => {
  const [notation, setNotation] = useState<ErNotation>(initialNotation);
  return (
    <ReactFlowProvider>
      <ErDiagram
        erDoc={erDoc}
        notation={notation}
        erEdgeNotation={notation.edgeMarkers}
        onErEdgeNotationChange={(newNotation) => {
          setNotation(newNotation);
        }}
      />
    </ReactFlowProvider>
  );
};

const ErDiagram = ({
  erDoc,
  notation,
  onErEdgeNotationChange,
}: ErDiagramProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const { layoutElements } = useLayoutedElements();
  const { d3LayoutElements } = useD3LayoutedElements();
  const { ColaLayoutElements } = useColaLayoutedElements();

  const isFirstRenderRef = useRef<boolean | null>(true);
  const nodesInitialized = useNodesInitialized();
  const { fitView } = useReactFlow();

  const erNodeTypes = useMemo(() => notation.nodeTypes, [notation]);
  const erEdgeTypes = useMemo(() => notation.edgeTypes, [notation]);
  const erEdgeNotation = useMemo(() => notation.edgeMarkers, [notation]);

  useEffect(() => {
    if (erDoc === null) return;
    const [newNodes, newEdges] = erToReactflowElements(erDoc, erEdgeNotation);

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
    if (isFirstRenderRef.current === true && nodesInitialized) {
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
        window.requestAnimationFrame(() => fitView());
        isFirstRenderRef.current = false;
      };
      void updateElements();
    } else if (isFirstRenderRef.current === false) {
      window.requestAnimationFrame(() => fitView());
      isFirstRenderRef.current = null;
    }
  }, [nodes, edges]);

  return (
    <ReactFlow
      nodes={nodes}
      onNodesChange={onNodesChange}
      nodeTypes={erNodeTypes}
      edges={edges}
      onEdgesChange={onEdgesChange}
      edgeTypes={erEdgeTypes}
      proOptions={{ hideAttribution: true }}
    >
      <Background
        id="1"
        gap={10}
        color="#f1f1f1"
        variant={BackgroundVariant.Lines}
      />
      <Background
        id="2"
        gap={100}
        offset={1}
        color="#e3e1e1"
        variant={BackgroundVariant.Lines}
      />

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
        {/* <button
          onClick={() => {
            void layoutElements({
              "elk.algorithm": "org.eclipse.elk.radial",
              "elk.portLabels.placement": "ALWAYS_SAME_SIDE",
            });
          }}
        >
          ELK radial layout
        </button> */}

        <br />
        <button
          onClick={() => {
            void layoutElements({
              "elk.algorithm": "org.eclipse.elk.force",
              // "elk.force.model": "EADES",
              // "elk.force.repulsion": "20",
              "elk.force.temperature": "0.05",
              "elk.spacing.nodeNode": "4",
              "elk.force.iterations": "1500",
            });
          }}
        >
          ELK 5K force layout
        </button>

        <br />
        <button onClick={d3LayoutElements}>d3-force Layout</button>

        <br />
        <button onClick={ColaLayoutElements}>Cola Layout</button>
      </Panel>

      <Panel position="top-left">
        <NotationPicker
          initialNotation={notation}
          className=""
          onNotationChange={(newNotation) =>
            onErEdgeNotationChange(newNotation)
          }
        />
      </Panel>
      <CustomSVGs />
      <ControlPanel />
    </ReactFlow>
  );
};

export { NotationSelectorErDiagramWrapper as ErDiagram };
