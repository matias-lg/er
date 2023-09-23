import { Edge } from "reactflow";
import { Entity } from "../../ERDoc/types/parser/Entity";
import {
  CompositeAttributeNode,
  EntityAttributeNode,
  EntityNode,
  EntityEdge,
  IsANode,
} from "../types/ErDiagram";
import { createEntityNodeId } from "./common";

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
      source: childEntityNodeId,
      target: isANodeId,
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
    position: {
      x: 500,
      y: 150,
    },
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
      position: { x: attrNodeXoffset, y: 100 },
    });

    edges.push({
      id: `entity-attr: ${entity.name}->${attr.name}`,
      source: attrID,
      target: entityId,
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
        source: childAttrID,
        target: attrID,
        sourceHandle: "l",
        targetHandle: "r",
        type: "erEdge",
      });
      childAttrXOffset += 100;
    }
  }

  return [nodes, edges];
};
