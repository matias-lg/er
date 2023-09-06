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

const BestNode = ({ data }: { data: { label: string } }) => (
  <>
    <div className="border-2 border-black p-2">
      <strong>{data.label}</strong>
    </div>
    <Handle
      position={Position.Top}
      type="source"
      style={{
        position: "absolute",
        top: "50%",
        right: "50%",
        transform: "translate(50%,-50%)",
      }}
    />
    <Handle
      position={Position.Top}
      type="target"
      style={{
        position: "absolute",
        top: "50%",
        right: "50%",
        transform: "translate(50%,-50%)",
      }}
    />
  </>
);

const nodeTypes = { best: BestNode };

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
    const attributeNodes: Node[] = [];
    const attributeEdges: Edge[] = [];

    for (const entity of erDoc.entities) {
      const newEntityNode = {
        id: entity.name,
        type: "best",
        data: { label: entity.name },
        position: {
          x: 0,
          y: 0,
        },
      };
      entityNodes.push(newEntityNode);
      // create attr nodes and an edge to the entity
      for (const attr of entity.attributes) {
        const attrID = `${entity.name}-${attr.name}`;
        attributeNodes.push({
          id: attrID,
          type: "best",
          data: { label: attr.name },
          position: { x: 0, y: 0 },
        });

        attributeEdges.push({
          id: `${attrID}-${entity.name}`,
          source: attrID,
          target: entity.name,
          type: "straight",
        });
      }
    }

    const relationshipNodes: Node[] = [];
    const relationshipEdges: Edge[] = [];

    for (const rel of erDoc.relationships) {
      // create a node for the relationship
      const relationshipID = `${rel.name}-${rel.attributes
        .map((attr) => attr.name)
        .sort()
        .join("-")}`;

      const relationshipNode: Node = {
        id: relationshipID,
        type: "best",
        data: { label: rel.name },
        position: { x: 0, y: 0 },
      };
      relationshipNodes.push(relationshipNode);

      console.log(relationshipID);

      // add an edge to each entity
      for (const entity of rel.participantEntities) {
        relationshipEdges.push({
          id: `${relationshipID}-${entity.entityName}`,
          source: entity.entityName,
          target: relationshipID,
          type: "straight",
        });
      }
    }
    console.log(edges);

    setNodes([...entityNodes, ...relationshipNodes, ...attributeNodes]);
    setEdges([...relationshipEdges, ...attributeEdges]);
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
