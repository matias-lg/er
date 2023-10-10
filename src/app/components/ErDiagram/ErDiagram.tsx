import { Radio, RadioGroup, Spinner, Stack } from "@chakra-ui/react";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Panel,
  ReactFlowProvider,
  useEdgesState,
  useNodesInitialized,
  useNodesState,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import { ER } from "../../../ERDoc/types/parser/ER";
import { AggregationNode } from "../../types/ErDiagram";
import { erToReactflowElements } from "../../util/erToReactflowElements";
import { ControlPanel } from "./ControlPanel";
import CustomSVGs from "./CustomSVGs";
import { NotationPicker } from "./NotationPicker";
import ArrowNotation from "./notations/ArrowNotation/ArrowNotation";
import ErNotation from "./notations/DefaultNotation";
import { useColaLayoutedElements } from "./useColaLayoutedElements";
import { useD3LayoutedElements } from "./useD3LayoutedElements";
import {
  getLayoutedElements,
  useLayoutedElements,
} from "./useLayoutedElements";
import { useAlignmentGuide } from "./useAlignmentGuide";
import MinMaxNotation from "./notations/MinMaxNotation/MinMaxNotation";

const notations = {
  arrow: ArrowNotation,
  minmax: MinMaxNotation,
};
type NotationTypes = keyof typeof notations;

type ErDiagramProps = {
  erDoc: ER;
  notation: ErNotation;
  notationType: NotationTypes;
  setEdgesOrthogonal: (isOrthogonal: boolean) => void;
  onNotationChange: (newNotationType: NotationTypes) => void;
  erEdgeNotation: ErNotation["edgeMarkers"];
};

const NotationSelectorErDiagramWrapper = ({ erDoc }: { erDoc: ER }) => {
  const [edgesOrthogonal, setEdgesOrthogonal] = useState<boolean>(false);
  const [notationType, setNotationType] =
    useState<NotationTypes>("arrow");
  const notation = useMemo(
    () => new notations[notationType](edgesOrthogonal),
    [notationType, edgesOrthogonal],
  );

  return (
    <ReactFlowProvider>
      <ErDiagram
        erDoc={erDoc}
        notation={notation}
        erEdgeNotation={notation.edgeMarkers}
        notationType={notationType}
        onNotationChange={(newNotationType) => setNotationType(newNotationType)}
        setEdgesOrthogonal={setEdgesOrthogonal}
      />
    </ReactFlowProvider>
  );
};

const ErDiagram = ({
  erDoc,
  notation,
  notationType,
  onNotationChange,
  setEdgesOrthogonal,
}: ErDiagramProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const { layoutElements } = useLayoutedElements();
  const { d3LayoutElements } = useD3LayoutedElements();
  const { ColaLayoutElements } = useColaLayoutedElements();
  const [isLayouting, setIsLayouting] = useState(false);

  const isFirstRenderRef = useRef<boolean | null>(true);
  const nodesInitialized = useNodesInitialized();
  const { fitView } = useReactFlow();

  const erNodeTypes = useMemo(() => notation.nodeTypes, [notation]);
  const erEdgeTypes = useMemo(() => notation.edgeTypes, [notation]);
  const erEdgeNotation = useMemo(() => notation.edgeMarkers, [notation]);
  const { onNodeDrag, onNodeDragStart, onNodeDragStop } = useAlignmentGuide();

  useEffect(() => {
    if (erDoc === null) return;
    const [newNodes, newEdges] = erToReactflowElements(erDoc, erEdgeNotation);

    setNodes((nodes) => {
      for (const newNode of newNodes) {
        // hack: on first render, hide the nodes before they are layouted
        if (isFirstRenderRef.current === true) {
          newNode.style = {
            ...newNode.style,
            opacity: 0,
          };
        }

        // if the node already exists, keep its position
        let oldNode;
        // old node by data.erId
        oldNode = nodes.find(
          (oldNode) => oldNode.data.erId === newNode.data.erId,
        );
        // old node by index id
        if (oldNode === undefined)
          oldNode = nodes.find((oldNode) => oldNode.id === newNode.id);

        if (oldNode !== undefined) {
          newNode.position = oldNode.position;
          // for aggregations, don't modify its size
          if (newNode.type === "aggregation") {
            newNode.data.height = (oldNode as AggregationNode).data.height;
            newNode.data.width = (oldNode as AggregationNode).data.width;
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
  }, [erDoc, erEdgeNotation, setEdges, setNodes]);

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
  }, [nodes, edges, fitView, nodesInitialized, setEdges, setNodes]);

  return (
    <ReactFlow
      nodes={nodes}
      onNodesChange={onNodesChange}
      nodeTypes={erNodeTypes}
      edges={edges}
      onEdgesChange={onEdgesChange}
      edgeTypes={erEdgeTypes}
      onNodeDrag={onNodeDrag}
      onNodeDragStart={onNodeDragStart}
      onNodeDragStop={onNodeDragStop}
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
            setIsLayouting(true);
            void layoutElements({
              "elk.algorithm": "org.eclipse.elk.stress",
              "elk.stress.desiredEdgeLength": "110",
            }).then(() => setIsLayouting(false));
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
            setIsLayouting(true);
            void layoutElements({
              "elk.algorithm": "org.eclipse.elk.force",
              // "elk.force.model": "EADES",
              // "elk.force.repulsion": "20",
              "elk.force.temperature": "0.05",
              "elk.spacing.nodeNode": "4",
              "elk.force.iterations": "1500",
            }).then(() => setIsLayouting(false));
          }}
        >
          ELK 5K force layout
        </button>

        <br />
        <button
          onClick={() => {
            setIsLayouting(true);
            d3LayoutElements();
            setIsLayouting(false);
          }}
        >
          d3-force Layout
        </button>

        <br />
        <button
          onClick={() => {
            setIsLayouting(true);
            // HACK: wrap in promise to allow state to update
            void new Promise((resolve) => setTimeout(resolve, 1))
              .then(() => {
                ColaLayoutElements();
              })
              .then(() => setIsLayouting(false));
          }}
        >
          Cola Layout
        </button>
      </Panel>

      <Panel position="top-left">
        {isLayouting && <Spinner color="black" />}
      </Panel>

      <Panel position="bottom-right">
        <NotationPicker
          initialNotation={notationType}
          onNotationChange={(newNotation) => onNotationChange(newNotation)}
        />

        <RadioGroup
          defaultValue="1"
          onChange={(v) => setEdgesOrthogonal(v === "2")}
        >
          <Stack spacing={5} direction="row">
            <Radio colorScheme="purple" value="1">
              Straight
            </Radio>
            <Radio colorScheme="purple" value="2">
              Orthogonal
            </Radio>
          </Stack>
        </RadioGroup>
      </Panel>
      <CustomSVGs />
      <ControlPanel />
    </ReactFlow>
  );
};

export { NotationSelectorErDiagramWrapper as ErDiagram };
