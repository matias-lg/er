import { Edge } from "reactflow";
import { ER } from "../../ERDoc/types/parser/ER";
import { Entity } from "../../ERDoc/types/parser/Entity";
import {
  CompositeRelationParticipant,
  Relationship,
  simpleRelationParticipant,
} from "../../ERDoc/types/parser/Relationship";
import ErNotation from "../components/ErDiagram/notations/DefaultNotation";
import {
  CompositeAttributeNode,
  EntityAttributeNode,
  EntityEdge,
  EntityNode,
  ErNode,
  IsANode,
  RelationshipAttributeNode,
  RelationshipNode,
} from "../types/ErDiagram";
import {
  createEntityNodeId,
  createRelationshipId,
  createRelationshipNodeId,
} from "./common";

const inheritanceToReactflowElements = (
  childEntityNodeId: string,
  parentEntityNodeId: string,
): [IsANode, Edge[]] => {
  const isANodeId = `isA: ${childEntityNodeId}|${parentEntityNodeId}`;

  const isANode: IsANode = {
    id: isANodeId,
    type: "isA",
    data: {},
    position: { x: 0, y: 0 },
  };

  const edges = [
    {
      id: `isA: ${childEntityNodeId}|${parentEntityNodeId}`,
      source: isANodeId,
      target: childEntityNodeId,
      sourceHandle: "l",
      targetHandle: "r",
      type: "erEdge",
    },
    {
      id: `isA: ${parentEntityNodeId}|${childEntityNodeId}`,
      source: parentEntityNodeId,
      target: isANodeId,
      sourceHandle: "l",
      targetHandle: "r",
      type: "erEdge",
    },
  ];

  return [isANode, edges];
};

export const entityToReactflowElements = (
  entity: Entity,
  position: { x: number; y: number } = { x: 0, y: 0 },
): [
  (EntityNode | EntityAttributeNode | CompositeAttributeNode | IsANode)[],
  EntityEdge[],
] => {
  const nodes: (
    | EntityNode
    | EntityAttributeNode
    | CompositeAttributeNode
    | IsANode
  )[] = [];
  const edges: Edge[] = [];
  const entityId = createEntityNodeId(entity.name);

  const entityNode: EntityNode = {
    id: entityId,
    type: "entity",
    data: { label: entity.name, isWeak: entity.hasDependencies },
    position,
  };
  nodes.push(entityNode);

  if (entity.hasParent) {
    const [isANode, inheritanceEdges] = inheritanceToReactflowElements(
      entityId,
      createEntityNodeId(entity.parentName!),
    );
    nodes.push(isANode);
    edges.push(...inheritanceEdges);
  }

  // create attributes nodes and edges to the entity
  let attrNodeXoffset = -70;
  const ATTR_RELATIVE_Y = 100;
  for (const attr of entity.attributes) {
    const attrID = `entity-attr: ${entity.name}|${attr.name}`;
    nodes.push({
      id: attrID,
      type: "entity-attribute",
      data: {
        label: attr.name,
        isKey: attr.isKey,
        entityIsWeak: entity.hasDependencies,
      },
      parentNode: entityId,
      position: { x: attrNodeXoffset, y: ATTR_RELATIVE_Y },
    });

    edges.push({
      id: `entity-attr: ${entity.name}->${attr.name}`,
      source: entityId,
      target: attrID,
      sourceHandle: "l",
      targetHandle: "r",
      type: "erEdge",
    });
    attrNodeXoffset += 70;

    // if the attribute is composite, create nodes and edges for its components
    if (!attr.isComposite) continue;
    let childAttrXOffset = 100;
    for (const childAttrName of attr.childAttributesNames!) {
      const childAttrID = `entity-attr-composite: ${entity.name}|${attr.name}|${childAttrName}`;

      nodes.push({
        id: childAttrID,
        type: "composite-attribute",
        data: { label: childAttrName },
        parentNode: entityId,
        position: { x: childAttrXOffset, y: 200 },
      });

      edges.push({
        id: `entity-attr-composite: ${entity.name} ${attr.name}->${childAttrName}`,
        source: attrID,
        target: childAttrID,
        sourceHandle: "l",
        targetHandle: "r",
        type: "erEdge",
      });
      childAttrXOffset += 100;
    }
  }

  return [nodes, edges];
};

const createChildParticipantEdge = (
  child: simpleRelationParticipant,
  entity: CompositeRelationParticipant,
  relationshipId: string,
  relationshipNodeId: string,
  edgeStyle: ReturnType<ErNotation["edgeMarkers"]>,
  handleNumber: number = 0,
) => ({
  id: `${
    handleNumber === 0 ? "" : handleNumber
  }relationship-part: ${relationshipId}->${entity.entityName}->${
    child.entityName
  }`,
  label: child.entityName,
  source: relationshipNodeId,
  target: createEntityNodeId(entity.entityName),
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

// Add labeled edges for the roles
// We only support up to 5 roles.
// TODO: Set the handle ids
const childParticipantToEdge = (
  entity: CompositeRelationParticipant,
  edgeNotation: ErNotation["edgeMarkers"],
  relationshipId: string,
  relationshipNodeId: string,
): Edge[] => {
  const edges: Edge[] = [];

  let childHandleNumbers: number[] = [];
  // defines which handles the child participants will be connected to
  switch (entity.childParticipants.length) {
    case 1:
      childHandleNumbers = [0];
      break;
    case 2:
      childHandleNumbers = [1, 4];
      break;
    case 3:
      childHandleNumbers = [1, 0, 4];
      break;
    case 4:
      childHandleNumbers = [1, 2, 3, 4];
      break;
    default:
      childHandleNumbers = [1, 2, 0, 3, 4];
      break;
  }

  for (const [index, handleNo] of childHandleNumbers.entries()) {
    const child = entity.childParticipants[index];
    const edgeStyle = edgeNotation(
      child.cardinality,
      child.participation === "total",
    );
    edges.push(
      createChildParticipantEdge(
        child,
        entity,
        relationshipId,
        relationshipNodeId,
        edgeStyle,
        handleNo,
      ),
    );
  }
  return edges;
};

export const relationshipToReactflowElements = (
  relationship: Relationship,
  hasDependant: boolean,
  edgeNotation: ErNotation["edgeMarkers"],
  position: { x: number; y: number } = { x: 0, y: 0 },
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
    position,
  });

  // create a node and add an edge to each own attribute
  let attrOffset = -70;
  const ATTR_RELATIVE_Y = 150;
  for (const attr of relationship.attributes) {
    const attrID = `relationship-attr: ${relationshipId}|${attr.name}`;
    relationshipNodes.push({
      id: attrID,
      parentNode: relationshipNodeId,
      type: "relationship-attribute",
      data: { label: attr.name },
      position: { x: attrOffset, y: ATTR_RELATIVE_Y },
    });
    attrOffset += 70;

    relationshipEdges.push({
      id: `relationship-attr: ${relationshipId}->${attr.name}`,
      source: relationshipNodeId,
      target: attrID,
      sourceHandle: "l",
      targetHandle: "r",
      type: "erEdge",
    });
  }

  for (const entity of relationship.participantEntities) {
    if (entity.isComposite) {
      relationshipEdges.push(
        ...childParticipantToEdge(
          entity,
          edgeNotation,
          relationshipId,
          relationshipNodeId,
        ),
      );
    } else {
      const edgeStyle = edgeNotation(
        entity.cardinality,
        entity.participation === "total",
      );
      relationshipEdges.push({
        id: `relationship-part: ${relationshipId}->${entity.entityName}`,
        source: relationshipNodeId,
        target: createEntityNodeId(entity.entityName),
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

const relationshipsWithDependantsFromEr = (erDoc: ER): Relationship[] => {
  if (erDoc === null) return [];
  return erDoc.relationships.filter((rel) =>
    rel.participantEntities.some(
      (part) =>
        erDoc.entities.find((e) => e.name === part.entityName)?.dependsOn
          ?.relationshipName === rel.name,
    ),
  );
};

type Args = {
  nodes: ErNode[];
  edges: Edge[];
  aggregationName: string;
  aggregatedRelationshipNodeId: string;
  position: { x: number; y: number };
};

export const updateGraphElementsWithAggregation = ({
  nodes,
  edges,
  aggregationName,
  aggregatedRelationshipNodeId,
  position,
}: Args) => {
  // TODO: Layout the aggregation participants.

  const aggregationNodeId = createEntityNodeId(aggregationName);
  // BFS to find all nodes that are connected to the aggregated relationship node
  const visited = new Set<string>();
  const queue = [aggregatedRelationshipNodeId];
  while (queue.length > 0) {
    const nodeId = queue.shift()!;
    if (visited.has(nodeId)) continue;
    visited.add(nodeId);
    for (const edge of edges) {
      if (edge.source == nodeId || edge.target == nodeId) {
        if (
          /* avoid other relationship nodes */
          (edge.source.startsWith("relationship:") &&
            edge.source != aggregatedRelationshipNodeId) ||
          (edge.target.startsWith("relationship:") &&
            edge.target != aggregatedRelationshipNodeId)
        )
          continue;
        if (edge.data) {
          (edge as Edge<{ isInAggregation: boolean }>).data!.isInAggregation =
            true;
        }
        queue.push(edge.target == nodeId ? edge.source : edge.target);
      }
    }
  }

  nodes.forEach((node) => {
    if (visited.has(node.id)) {
      node.zIndex = 10;
      node.extent = "parent";
      node.parentNode = aggregationNodeId;
      node.position = { x: 0, y: 0 };
    }
  });

  nodes.push({
    id: aggregationNodeId,
    focusable: false,
    selectable: false,
    type: "aggregation",
    data: {
      label: aggregationName,
    },
    position,
  });
};

export const erToReactflowElements = (
  erDoc: ER,
  erEdgeNotation: ErNotation["edgeMarkers"],
): [ErNode[], Edge[]] => {
  if (erDoc === null) return [[], []];
  const newNodes: ErNode[] = [];
  const newEdges: Edge[] = [];
  const relationshipsWithDependants = relationshipsWithDependantsFromEr(erDoc);

  // TODO: set offset for entities and relationships
  let ENTITY_COLUMN = 500;
  let ent_offset = 0;

  for (const entity of erDoc.entities) {
    const [newEntityNodes, newEntityEdges] = entityToReactflowElements(entity, {
      x: ENTITY_COLUMN,
      y: ent_offset,
    });
    newNodes.push(...newEntityNodes);
    newEdges.push(...newEntityEdges);
    ent_offset += 150;
  }

  let RELATIONSHIP_COLUMN = 700;
  let rel_offset = 0;
  for (const rel of erDoc.relationships) {
    const [newRelNodes, newRelEdges] = relationshipToReactflowElements(
      rel,
      relationshipsWithDependants.some((r) => r.name === rel.name),
      erEdgeNotation,
      { x: RELATIONSHIP_COLUMN, y: rel_offset },
    );
    newNodes.push(...newRelNodes);
    newEdges.push(...newRelEdges);
    rel_offset += 150;

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
        position: { x: ENTITY_COLUMN, y: ent_offset },
      });
      ent_offset += 150;
    }
  }

  // now that we've processed all the ER logic, we convert the ids to just the index in the array.
  // this way, if  we rename an entity in the text editor the id will stay the same
  renameIdsToNumeric(newNodes, newEdges);

  return [newNodes, newEdges];
};

const renameIdsToNumeric = (nodes: ErNode[], edges: Edge[]) => {
  const id2index = new Map<string, string>();
  for (const [index, node] of nodes.entries()) {
    id2index.set(node.id, index.toString());
    node.data.erId = node.id;
    node.id = index.toString();
  }

  for (const node of nodes) {
    if (node.parentNode) {
      node.parentNode = id2index.get(node.parentNode)!;
    }
  }

  for (const edge of edges) {
    edge.source = id2index.get(edge.source)!;
    edge.target = id2index.get(edge.target)!;
  }
};
