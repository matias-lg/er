import { Edge } from "reactflow";
import { Relationship } from "../../ERDoc/types/parser/Relationship";
import { ErNotation } from "../types/ErDiagram";
import {
  createEntityNodeId,
  createRelationshipId,
  createRelationshipNodeId,
} from "./common";
import {
  RelationshipNode,
  RelationshipAttributeNode,
  CompositeAttributeNode,
} from "../types/ErDiagram";

export const relationshipToReactflowElements = (
  relationship: Relationship,
  hasDependant: boolean,
  edgeNotation: ErNotation["edgeMarkers"],
): [
  (RelationshipNode | RelationshipAttributeNode | CompositeAttributeNode)[],
  Edge[],
] => {
  const relationshipNodes: (
    | RelationshipNode
    | RelationshipAttributeNode
    | CompositeAttributeNode
  )[] = [];
  const relationshipEdges: Edge[] = [];
  const relationshipId = createRelationshipId(relationship);
  const relationshipNodeId = createRelationshipNodeId(relationshipId);

  relationshipNodes.push({
    id: relationshipNodeId,
    type: "relationship",
    data: { label: relationship.name, hasDependant },
    position: { x: 0, y: 0 },
  });

  // create a node and add an edge to each own attribute
  for (const attr of relationship.attributes) {
    const attrID = `relationship-attr: ${relationshipId}|${attr.name}`;
    relationshipNodes.push({
      id: attrID,
      parentNode: relationshipNodeId,
      type: "relationship-attribute",
      data: { label: attr.name },
      position: { x: 0, y: 0 },
    });

    relationshipEdges.push({
      id: `relationship-attr: ${relationshipId}->${attr.name}`,
      source: attrID,
      target: relationshipNodeId,
      sourceHandle: "l",
      targetHandle: "r",
      type: "erEdge",
    });
  }

  for (const entity of relationship.participantEntities) {
    if (entity.isComposite) {
      // Add labeled edges for the roles
      entity.childParticipants.forEach((child) => {
        const edgeStyle = edgeNotation(
          child.cardinality,
          child.participation === "total",
        );
        relationshipEdges.push({
          id: `relationship-part: ${relationshipId}->${entity.entityName}->${child.entityName}`,
          label: child.entityName,
          source: createEntityNodeId(entity.entityName),
          target: relationshipNodeId,
          sourceHandle: "l",
          targetHandle: "r",
          type: "erEdge",
          data: {
            cardinality: child.cardinality,
            isTotalParticipation: child.participation === "total",
          },
          markerStart: edgeStyle?.markerStart,
          markerEnd: edgeStyle?.markerEnd,
          style: edgeStyle?.style,
        });
      });
    } else {
      const edgeStyle = edgeNotation(
        entity.cardinality,
        entity.participation === "total",
      );
      relationshipEdges.push({
        id: `relationship-part: ${relationshipId}->${entity.entityName}`,
        source: createEntityNodeId(entity.entityName),
        target: relationshipNodeId,
        sourceHandle: "l",
        targetHandle: "r",
        type: "erEdge",
        data: {
          cardinality: entity.cardinality,
          isTotalParticipation: entity.participation === "total",
        },
        markerStart: edgeStyle?.markerStart,
        markerEnd: edgeStyle?.markerEnd,
        style: edgeStyle?.style,
      });
    }
  }
  return [relationshipNodes, relationshipEdges];
};
