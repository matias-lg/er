import { useCallback } from "react";
import { useReactFlow, useStore } from "reactflow";
import * as cola from "webcola";
import { adjustChildNodePosition } from "../../util/common";

export const useColaLayoutedElements = () => {
  const { getNodes, setNodes, getEdges, fitView } = useReactFlow<{
    constraints?: {
      type: "string";
      axis: "x" | "y";
      offsets: {
        node: string;
        offset: string;
      }[];
    }[];
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

    const constraints = [];
    for (const node of nodes) {
      if (node.data.constraints) {
        for (const con of node.data.constraints) {
          constraints.push({
            type: "alignment",
            axis: con.axis,
            offsets: con.offsets.map((offset) => ({
              node: node2idx.get(offset.node)!,
              offset: offset.offset,
            })),
          });
        }
      }
    }

    const layoutEdges = getEdges().map((edge) => ({
      source: node2idx.get(edge.source)!,
      target: node2idx.get(edge.target)!,
    }));

    const aggregationNodeIds = layoutNodes
      .filter((n) => n.type === "aggregation")
      .map((n) => n.id);

    const aggregationGroups: (cola.Group & { id: string })[] =
      aggregationNodeIds.map((aggNodeId) => {
        const childrenNodes = layoutNodes.filter(
          (n) => n.parentNode === aggNodeId,
        );

        return {
          id: aggNodeId,
          leaves: childrenNodes,
          padding: 10,
        };
      });

    const c = new cola.Layout().linkDistance(100).size([2000, 2000]);
    c.nodes(layoutNodes)
      .links(layoutEdges)
      .groups(aggregationGroups)
      .constraints(constraints)
      .start(1, 0, 3);

    // manually move the aggregation nodes
    for (const aggGroup of aggregationGroups) {
      if (aggGroup.leaves!.length < 2) continue;
      const agg = layoutNodes.find((n) => n.id === aggGroup.id)!;
      let [minX, minY, maxX, maxY] = [Infinity, Infinity, -Infinity, -Infinity];
      for (const leaf of aggGroup.leaves!) {
        minX = Math.min(minX, leaf.x);
        minY = Math.min(minY, leaf.y);
        maxX = Math.max(maxX, leaf.x + leaf.width!);
        maxY = Math.max(maxY, leaf.y + leaf.height!);
      }

      agg.data = {
        height: maxY - minY,
        width: maxX - minX,
      };
      agg.x = minX;
      agg.y = minY;
    }

    setNodes(
      layoutNodes.map((node) => adjustChildNodePosition(node, layoutNodes)),
    );
    window.requestAnimationFrame(() => fitView());
  }, [initialised]);
  return { ColaLayoutElements };
};
