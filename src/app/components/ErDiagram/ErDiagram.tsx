import { Spinner } from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  NodeDragHandler,
  OnInit,
  Panel,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { ER } from "../../../ERDoc/types/parser/ER";
import { AggregationNode } from "../../types/ErDiagram";
import { NotationTypes, notations } from "../../util/common";
import { erToReactflowElements } from "../../util/erToReactflowElements";
import { ConfigPanel } from "./ConfigPanel";
import { ControlPanel } from "./ControlPanel";
import EdgeCustomSVGs from "./EdgeCustomSVGs";
import { useAlignmentGuide } from "./hooks/useAlignmentGuide";
import { useColaLayoutedElements } from "./hooks/useColaLayoutedElements";
import { useD3LayoutedElements } from "./hooks/useD3LayoutedElements";
import { useDiagramToLocalStorage } from "./hooks/useDiagramToLocalStorage";
import { useLayoutedElements } from "./hooks/useLayoutedElements";
import ErNotation from "./notations/DefaultNotation";

type ErDiagramProps = {
  erDoc: ER;
  erDocHasError: boolean;
  notation: ErNotation;
  notationType: NotationTypes;
  setEdgesOrthogonal: (isOrthogonal: boolean) => void;
  onNotationChange: (newNotationType: NotationTypes) => void;
  erEdgeNotation: ErNotation["edgeMarkers"];
};

const NotationSelectorErDiagramWrapper = ({
  erDoc,
  erDocHasError,
}: {
  erDoc: ER;
  erDocHasError: boolean;
}) => {
  const [edgesOrthogonal, setEdgesOrthogonal] = useState<boolean>(false);
  const [notationType, setNotationType] = useState<NotationTypes>("arrow");
  const notation = useMemo(
    () => new notations[notationType](edgesOrthogonal),
    [notationType, edgesOrthogonal],
  );

  return (
    <ErDiagram
      erDoc={erDoc}
      erDocHasError={erDocHasError}
      notation={notation}
      erEdgeNotation={notation.edgeMarkers}
      notationType={notationType}
      onNotationChange={(newNotationType) => setNotationType(newNotationType)}
      setEdgesOrthogonal={setEdgesOrthogonal}
    />
  );
};

const ErDiagram = ({
  erDoc,
  erDocHasError,
  notation,
  notationType,
  onNotationChange,
  setEdgesOrthogonal,
}: ErDiagramProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const { d3LayoutElements } = useD3LayoutedElements();
  const { ColaLayoutElements } = useColaLayoutedElements();
  const [isLayouting, setIsLayouting] = useState(false);

  const erNodeTypes = useMemo(() => notation.nodeTypes, [notation]);
  const erEdgeTypes = useMemo(() => notation.edgeTypes, [notation]);
  const erEdgeNotation = useMemo(() => notation.edgeMarkers, [notation]);
  const { onNodeDrag, onNodeDragStart, onNodeDragStop } = useAlignmentGuide();
  const { saveToLocalStorage, loadFromLocalStorage, setRfInstance } =
    useDiagramToLocalStorage();

  useLayoutedElements();

  useEffect(() => {
    if (erDoc === null || erDocHasError) return;
    const [newNodes, newEdges] = erToReactflowElements(erDoc, erEdgeNotation);
    setNodes((nodes) => {
      const alreadyExists: string[] = [];
      const renaming = nodes.length === newNodes.length;

      return (
        nodes
          // if the node already exists, keep its position
          .map((oldNode) => {
            let newNode = newNodes.find(
              (newNode) => newNode.data.erId === oldNode.data.erId,
            );
            if (!newNode && renaming) {
              newNode = newNodes.find((newNode) => newNode.id === oldNode.id);
            }
            if (newNode) {
              alreadyExists.push(newNode.id);
              newNode.position = oldNode.position;
              // for aggregations, don't modify its size
              if (newNode.type === "aggregation") {
                newNode.data.height = (oldNode as AggregationNode).data.height;
                newNode.data.width = (oldNode as AggregationNode).data.width;
              }
              return newNode;
            }
            return undefined;
          })
          // add the new nodes
          .concat(newNodes.filter((nn) => !alreadyExists.includes(nn.id)))
          .filter((n) => n !== undefined)
          // hide all nodes before layouting
          .map((n) => ({
            ...n,
            style: {
              ...n!.style,
              opacity: 1,
            },
          }))
      );
    });

    setEdges(() => {
      // same hack as above
      // if (isFirstRenderRef.current === true) {
      return newEdges.map((e) => ({
        ...e,
        hidden: true,
        style: {
          ...e.style,
          opacity: 1,
        },
      }));
      // } else return newEdges;
    });

    setTimeout(saveToLocalStorage, 100);
  }, [
    erDoc,
    erEdgeNotation,
    setEdges,
    setNodes,
    saveToLocalStorage,
    erDocHasError,
  ]);

  useEffect(() => console.log("erdoc changed"), [erDoc]);
  useEffect(() => console.log("erdoc has error changed"), [erDocHasError]);
  useEffect(() => console.log("erEdgeNotation changed"), [erEdgeNotation]);
  useEffect(() => console.log("setEdges changed"), [setEdges]);
  useEffect(() => console.log("setNodes changed"), [setNodes]);
  useEffect(
    () => console.log("saveToLocalStorage changed"),
    [saveToLocalStorage],
  );

  /* On initial render, load from storage or auto layout the default content */
  useEffect(() => {
    loadFromLocalStorage();
  }, []);

  // add defs to viewport so they appear when exporting to image
  const handleInit: OnInit = useCallback(
    (rf) => {
      setRfInstance(rf);
      const viewport = document.querySelector(".react-flow__viewport")!;
      const defs = document.querySelector("#defs")!;
      viewport.append(defs);
    },
    [setRfInstance],
  );

  const onNodeDragStartHandler: NodeDragHandler = (e, node, nodes) => {
    saveToLocalStorage();
    onNodeDragStart(e, node, nodes);
  };

  const onNodeDragStopHandler: NodeDragHandler = (e, node, nodes) => {
    saveToLocalStorage();
    onNodeDragStop(e, node, nodes);
  };

  return (
    <ReactFlow
      onInit={handleInit}
      nodes={nodes}
      onNodesChange={onNodesChange}
      nodeTypes={erNodeTypes}
      edges={edges}
      onEdgesChange={onEdgesChange}
      edgeTypes={erEdgeTypes}
      onNodeDrag={onNodeDrag}
      onNodeDragStart={onNodeDragStartHandler}
      onNodeDragStop={onNodeDragStopHandler}
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

      <Panel position="bottom-right">
        <br />
        {/* <button
          onClick={() => {
            setIsLayouting(true);
            void layoutElements({
              "elk.algorithm": "org.eclipse.elk.stress",
              "elk.stress.desiredEdgeLength": "110",
            }).then(() => setIsLayouting(false));
          }}
        >
          ELK stress layout
        </button> */}

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

        {/* <br />
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
        </button> */}

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
        <br />
        {erDocHasError && <span>Fix Errors to sync layout!</span>}
      </Panel>

      <Panel position="top-right">
        <ConfigPanel
          notationType={notationType}
          setEdgesOrthogonal={setEdgesOrthogonal}
          onNotationChange={onNotationChange}
        />
      </Panel>
      <EdgeCustomSVGs />
      <ControlPanel onLayoutClick={saveToLocalStorage} />
    </ReactFlow>
  );
};

export { NotationSelectorErDiagramWrapper as ErDiagram };
