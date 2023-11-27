import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Edge,
  NodeDragHandler,
  OnInit,
  Panel,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import { ER } from "../../../ERDoc/types/parser/ER";
import { Context } from "../../context";
import { AggregationNode, ErNode } from "../../types/ErDiagram";
import { NotationTypes, notations } from "../../util/common";
import { erToReactflowElements } from "../../util/erToReactflowElements";
import { ConfigPanel } from "./ConfigPanel";
import { ControlPanel } from "./ControlPanel";
import EdgeCustomSVGs from "./EdgeCustomSVGs";
import { useAlignmentGuide } from "../../hooks/useAlignmentGuide";
import { useDiagramToLocalStorage } from "../../hooks/useDiagramToLocalStorage";
import { useLayoutedElements } from "../../hooks/useLayoutedElements";
import ErNotation from "./notations/DefaultNotation";
import { useTranslations } from "next-intl";
import { DiagramChange } from "../../types/CodeEditor";

type ErDiagramProps = {
  erDoc: ER;
  erDocHasError: boolean;
  notation: ErNotation;
  notationType: NotationTypes;
  lastChange: DiagramChange | null;
  setEdgesOrthogonal: (isOrthogonal: boolean) => void;
  onNotationChange: (newNotationType: NotationTypes) => void;
  erEdgeNotation: ErNotation["edgeMarkers"];
};

const NotationSelectorErDiagramWrapper = ({
  erDoc,
  erDocHasError,
  lastChange,
}: {
  erDoc: ER;
  lastChange: DiagramChange | null;
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
      lastChange={lastChange}
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
  lastChange,
  onNotationChange,
  setEdgesOrthogonal,
}: ErDiagramProps) => {
  const t = useTranslations("home.erDiagram");
  const erNodeTypes = useMemo(() => notation.nodeTypes, [notation]);
  const erEdgeTypes = useMemo(() => notation.edgeTypes, [notation]);
  const erEdgeNotation = useMemo(() => notation.edgeMarkers, [notation]);

  const [prevErDoc, setPrevErDoc] = useState<ER | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<ErNode["data"]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const { fitView } = useReactFlow();
  const { autoLayoutEnabled } = useContext(Context);

  const { onNodeDrag, onNodeDragStart, onNodeDragStop } = useAlignmentGuide();
  const { saveToLocalStorage, loadFromLocalStorage, setRfInstance } =
    useDiagramToLocalStorage();
  useLayoutedElements(autoLayoutEnabled);

  useEffect(() => {
    if (lastChange?.type === "json" || lastChange?.type === "localStorage") {
      const nodePositions = lastChange.positions.nodes;
      setNodes((nodes) => {
        return nodes.map((node) => {
          const savedNode = nodePositions.find((n) => n.id === node.id);
          if (savedNode) {
            return {
              ...node,
              position: savedNode.position,
            };
          } else return node;
        });
      });
      setTimeout(saveToLocalStorage, 100);
    }
  }, [lastChange, saveToLocalStorage, setNodes, fitView]);

  if (!erDocHasError && erDoc !== prevErDoc) {
    setPrevErDoc(erDoc);
    const [fromErNodes, fromErEdges] = erToReactflowElements(
      erDoc,
      erEdgeNotation,
    );
    const renaming =
      nodes.length === fromErNodes.length &&
      edges.length === fromErEdges.length;
    const hideItems = !renaming && autoLayoutEnabled;
    // @ts-ignore
    setNodes((nodes) => {
      const alreadyExists: string[] = [];
      return (
        nodes
          // if the node already exists, keep its position
          .map((oldNode) => {
            let newNode = fromErNodes.find(
              (newNode) => newNode.data.erId === oldNode.data.erId,
            );
            if (!newNode && renaming) {
              newNode = fromErNodes.find(
                (newNode) => newNode.id === oldNode.id,
              );
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
          .filter((n) => n !== undefined)
          // hide the new nodes and add them
          .concat(
            fromErNodes
              .filter((nn) => !alreadyExists.includes(nn.id))
              .map((newNode) => ({
                ...newNode,
                style: { ...newNode.style, opacity: hideItems ? 0 : 1 },
              })),
          )
      );
    });

    setEdges((oldEdges) => {
      const alreadyExists: string[] = [];
      return oldEdges
        .map((oldEdge) => {
          const updatedEdge = fromErEdges.find((ne) => ne.id === oldEdge.id);
          if (updatedEdge) alreadyExists.push(updatedEdge.id);
          return updatedEdge;
        })
        .concat(
          fromErEdges
            .filter((ne) => !alreadyExists.includes(ne.id))
            .map((e) => ({ ...e, hidden: hideItems ? true : false })),
        )
        .filter((e) => e !== undefined) as Edge[];
    });
    setTimeout(saveToLocalStorage, 100);
  }

  useEffect(() => {
    if (!autoLayoutEnabled) {
      setTimeout(() => window.requestAnimationFrame(() => fitView()), 10);
    }
  }, [nodes.length, autoLayoutEnabled, fitView]);

  // add defs to viewport so they appear when exporting to image
  const handleInit: OnInit = useCallback(
    (rf) => {
      setRfInstance(rf);
      const viewport = document.querySelector(".react-flow__viewport")!;
      const defs = document.querySelector("#defs")!;
      viewport.append(defs);
      // on mount, load from local storage
      loadFromLocalStorage();
    },
    [setRfInstance, loadFromLocalStorage],
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

      <Panel position="top-left">
        {erDocHasError && (
          <div className="absolute w-52 rounded border-2 border-red-950 bg-red-800 p-1 text-slate-200">
            <p>{t("fixErrorsToSync")}</p>
          </div>
        )}
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
