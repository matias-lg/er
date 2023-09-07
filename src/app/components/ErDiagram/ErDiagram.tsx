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
    // TODO: Aggregations

    for (const entity of erDoc.entities) {
      const [newEntityNodes, newEntityEdges] =
        entityToReactflowElements(entity);
      entityNodes.push(...newEntityNodes);
      attributeEdges.push(...newEntityEdges);
    }

    for (const rel of erDoc.relationships) {
      // create a node for the relationship
      const relationshipID = `${rel.name}-${rel.attributes
        .map((attr) => attr.name)
        .sort()
        .join("-")}`;

      // TODO: Calculate this somewhere else.
      // check if the relationship has a dependant entity
      const hasDependant = rel.participantEntities.some(
        (part) =>
          erDoc.entities.find((e) => e.name === part.entityName)?.dependsOn
            ?.relationshipName === rel.name,
      );

      const relationshipNode = {
        id: relationshipID,
        type: "relationship",
        data: { label: rel.name, hasDependant },
        position: { x: 0, y: 0 },
      };
      relationshipNodes.push(relationshipNode);

      // create a node and add an edge to each own attribute
      for (const attr of rel.attributes) {
        const attrID = `${relationshipID}-${attr.name}`;
        if (!attr.isComposite) {
          attributeNodes.push({
            id: attrID,
            type: "relationship-attribute",
            data: { label: attr.name, isKey: false },
            position: { x: 0, y: 0 },
          });
        }
        // TODO check composite case

        attributeEdges.push({
          id: `${attrID}-${relationshipID}`,
          source: attrID,
          target: relationshipID,
          type: "straight",
        });
      }

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
