import { useState, useCallback, useEffect, useMemo } from "react";
import ReactFlow, {
  Node,
  NodeChange,
  Edge,
  EdgeChange,
  Controls,
  Background,
  BackgroundVariant,
  applyNodeChanges,
  applyEdgeChanges,
  NodeTypes,
} from "reactflow";
import { ER } from "../../../ERDoc/types/parser/ER";
import "reactflow/dist/style.css";
import ArrowNotation from "./notations/ArrowNotation";
import { entityToReactflowElements } from "../../util/entityToReactflowElements";
import { relationshipToReactflowElements } from "../../util/relationshipToReactflowElements";

type ErDiagramProps = {
  erDoc: ER;
  notation: NodeTypes;
};

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

const NotationSelectorErDiagram = ({ erDoc }: { erDoc: ER }) => {
  const [currentNotation, _] = useState<NodeTypes>(ArrowNotation);
  return <ErDiagram erDoc={erDoc} notation={currentNotation} />;
};

function ErDiagram({ erDoc, notation }: ErDiagramProps) {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const nodeTypes = useMemo(() => notation, []);
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
    }
    // TODO: Aggregations
    // aggregations are a subflow encapsulating a relationship, its attributes and its entities (including their attributes)

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

export { NotationSelectorErDiagram };
export default ErDiagram;
