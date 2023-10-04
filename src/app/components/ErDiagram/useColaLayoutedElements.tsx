import { useCallback } from "react";
import { useReactFlow, useStore } from "reactflow";
import * as cola from "webcola";
import { updateNodePosition } from "../../util/common";
import { NodeConstraints } from "../../types/ErDiagram";

type ColaConstraints = (
  | {
      type: "alignment";
      axis: "x" | "y";
      offsets: { node: number; offset: string }[];
    }
  | {
      type: "inequality";
      axis: "x" | "y";
      left: number;
      right: number;
      gap: number;
    }
)[];

export const useColaLayoutedElements = () => {
  const { getNodes, setNodes, getEdges, fitView } = useReactFlow<{
    constraints?: NodeConstraints;
    label: string;
    width: number;
    height: number;
  }>();

  const initialised = useStore((store) =>
    [...store.nodeInternals.values()].every(
      (node) => node.width && node.height,
    ),
  );

  const ColaLayoutElements = useCallback((): void => {
    const nodes = getNodes();
    // ensure reactflow has initialised nodes
    if (!initialised || nodes.length === 0) return;

    const node2idx = new Map<string, number>();
    const layoutNodes = nodes.map((node, idx) => {
      node2idx.set(node.id, idx);
      return {
        ...node,
        width: node.width || 0,
        height: node.height || 0,
        index: idx,
        x: 0,
        y: 0,
      };
    });

    let constraints: ColaConstraints = [];
    for (const node of nodes) {
      if (node.data.constraints) {
        constraints = nodeConstrainsToColaConstraints(
          node.data.constraints,
          node2idx,
        );
      }
    }

    const layoutEdges = getEdges().map((edge) => ({
      source: node2idx.get(edge.source)!,
      target: node2idx.get(edge.target)!,
    }));

    const entityGroups: (cola.Group & { id: string; idx: number })[] =
      layoutNodes
        .filter((n) => n.type === "entity")
        .map((entity) => entity.id)
        .map((entityId, idx) => ({
          id: entityId,
          idx: idx,
          leaves: layoutNodes.filter(
            (n) => n.id === entityId || n.parentNode === entityId,
          ),
          padding: 10,
        }));

    const aggregationGroups: (cola.Group & { id: string })[] = layoutNodes
      .filter((n) => n.type === "aggregation")
      .map((aggregation) => aggregation.id)
      .map((aggId) => {
        const children = layoutNodes.filter((n) => n.parentNode === aggId);
        return {
          id: aggId,
          leaves: children,
          groups: entityGroups.filter((group) =>
            children.some((c) => c.id === group.id),
          ),
          // .map((g) => g.idx),
          padding: 10,
        };
      });
    console.log(constraints);
    new cola.Layout()
      .linkDistance(100)
      .size([2000, 2000])
      .nodes(layoutNodes)
      .links(layoutEdges)
      .groups([...entityGroups, ...aggregationGroups])
      .constraints(constraints)
      // .groups(aggregationGroups)
      .jaccardLinkLengths(100)
      .flowLayout("x", 500)
      .start(3, 0, 100);

    // manually move the aggregation nodes
    for (const aggGroup of aggregationGroups) {
      if (aggGroup.leaves!.length < 2) continue;
      const PADDING = 50;
      const agg = layoutNodes.find((n) => n.id === aggGroup.id)!;
      let [minX, minY, maxX, maxY] = [Infinity, Infinity, -Infinity, -Infinity];
      for (const leaf of aggGroup.leaves!) {
        minX = Math.min(minX, leaf.x);
        minY = Math.min(minY, leaf.y);
        maxX = Math.max(maxX, leaf.x + leaf.width!);
        maxY = Math.max(maxY, leaf.y + leaf.height!);
      }

      agg.data = {
        label: agg.data.label,
        height: maxY - minY + PADDING,
        width: maxX - minX + PADDING,
      };
      agg.x = minX - PADDING / 2;
      agg.y = minY - PADDING / 2;
    }

    setNodes(layoutNodes.map((node) => updateNodePosition(node, layoutNodes)));
    window.requestAnimationFrame(() => fitView());
  }, [initialised]);
  return { ColaLayoutElements };
};

const nodeConstrainsToColaConstraints = (
  nodeConstraints: NodeConstraints,
  node2idxMap: Map<string, number>,
): ColaConstraints => {
  const constraints = [];
  for (const con of nodeConstraints) {
    if (con.type === "alignment") {
      const offsets = [];
      for (const offsetObj of con.offsets) {
        offsets.push({
          node: node2idxMap.get(offsetObj.node)!,
          offset: offsetObj.offset,
        });
      }
      constraints.push({
        type: con.type,
        axis: con.axis,
        offsets,
      });
    }

    if (con.type === "inequality") {
      constraints.push({
        type: con.type,
        axis: con.axis,
        left: node2idxMap.get(con.left)!,
        right: node2idxMap.get(con.right)!,
        gap: con.gap,
      });
    }
  }

  return constraints;
};
