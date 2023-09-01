import { useState, useCallback, useEffect } from "react";
import ReactFlow, {
  Node,
  Handle,
  Position,
  NodeChange,
  Edge,
  EdgeChange,
  Controls,
  Background,
  BackgroundVariant,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";
import { ER } from "../../../ERDoc/types/parser/ER";
import "reactflow/dist/style.css";

type ErDiagramProps = {
  erDoc: ER;
};

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

const BestNode = () => {
  return (
    <>
      <Handle type="target" id="top" position={Position.Top} />
      <Handle type="target" id="right" position={Position.Right} />
      <Handle type="target" id="bottom" position={Position.Bottom} />
      <Handle type="target" id="left" position={Position.Left} />
    </>
  );
};

const nodeTypes = {
  best: BestNode,
};

function ErDiagram({ erDoc }: ErDiagramProps) {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );

  useEffect(() => {
    if (erDoc === null) return;
    const entityNodes: Node[] = [];

    for (const entity of erDoc.entities) {
      const newEntityNode = {
        id: entity.name,
        data: { label: entity.name },
        position: {
          x: 0,
          y: 0,
        },
      };
      entityNodes.push(newEntityNode);
    }

    const relationshipNodes: Node[] = [];
    const EREdges: Edge[] = [];

    for (const rel of erDoc.relationships) {
      // create a node for the relationship
      const relationshipID = `${rel.name}:${rel.attributes
        .map((attr) => attr.name)
        .sort()
        .join("-")}`;

      const relationshipNode: Node = {
        id: relationshipID,
        data: { label: rel.name },
        position: { x: 0, y: 0 },
        type: "best",
      };
      relationshipNodes.push(relationshipNode);

      // add an edge to each entity
      const availableHandles = ["top", "right", "bottom", "left"];
      for (const entity of rel.participantEntities) {
        EREdges.push({
          id: `${relationshipID}==${entity.entityName}`,
          source: entity.entityName,
          targetHandle: availableHandles.pop() || "top",
          target: relationshipID,
          label: "",
          type: "step",
        });
      }
    }

    setNodes([...entityNodes, ...relationshipNodes]);
    setEdges([...EREdges]);
  }, [erDoc]);

  return (
    <ReactFlow
      nodes={nodes}
      onNodesChange={onNodesChange}
      edges={edges}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
    >
      <Background variant={BackgroundVariant.Cross} />
      <Controls />
    </ReactFlow>
  );
}

export default ErDiagram;
