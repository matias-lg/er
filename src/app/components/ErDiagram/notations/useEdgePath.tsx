import { useCallback } from "react";
import {
  HandleElement,
  Node,
  Position,
  getStraightPath,
  internalsSymbol,
  useStore,
} from "reactflow";

const getParams = (
  nodeA: Node,
  nodeB: Node,
  handlePrefix: string,
): [number, number, Position] => {
  const centerA = getNodeCenter(nodeA);
  const centerB = getNodeCenter(nodeB);

  const horizontalDiff = Math.abs(centerA.x - centerB.x);
  const verticalDiff = Math.abs(centerA.y - centerB.y);

  let position;

  // when the horizontal difference between the nodes is bigger, we use Position.Left or Position.Right for the handle
  if (horizontalDiff > verticalDiff) {
    position = centerA.x > centerB.x ? Position.Left : Position.Right;
  } else {
    // here the vertical difference between the nodes is bigger, so we use Position.Top or Position.Bottom for the handle
    position = centerA.y > centerB.y ? Position.Top : Position.Bottom;
  }

  const [x, y] = getHandleCoordsByPosition(nodeA, position, handlePrefix);
  return [x, y, position];
};

const getHandleCoordsByPosition = (
  node: Node,
  handlePosition: Position,
  handlePrefix: string,
): number[] => {
  let handleMatchCondition = (h: HandleElement) =>
    h.position === handlePosition;
  if (handlePrefix !== "") {
    handleMatchCondition = (h: HandleElement) =>
      h.position === handlePosition && h.id![0] === handlePrefix;
  }

  let handle = node[internalsSymbol]?.handleBounds?.source?.find((h) =>
    handleMatchCondition(h),
  );
  if (handle === undefined)
    handle = node[internalsSymbol]?.handleBounds?.target?.find((h) =>
      handleMatchCondition(h),
    );

  const offsetX = handle!.width / 2;
  const offsetY = handle!.height / 2;

  const x = node.positionAbsolute!.x + handle!.x + offsetX;
  const y = node.positionAbsolute!.y + handle!.y + offsetY;

  return [x, y];
};

const getNodeCenter = (node: Node) => {
  return {
    x: node.positionAbsolute!.x + node.width! / 2,
    y: node.positionAbsolute!.y + node.height! / 2,
  };
};

// returns the parameters (sx, sy, tx, ty, sourcePos, targetPos) you need to create an edge
const getErEdgeParams = (
  source: Node,
  target: Node,
  handlePrefix: string,
): {
  sx: number;
  sy: number;
  tx: number;
  ty: number;
  sourcePos: Position;
  targetPos: Position;
} => {
  const [sx, sy, sourcePos] = getParams(source, target, handlePrefix);
  const [tx, ty, targetPos] = getParams(target, source, handlePrefix);

  return {
    sx,
    sy,
    tx,
    ty,
    sourcePos,
    targetPos,
  };
};

export const useEdgePath = (
  sourceNodeId: string,
  targetNodeId: string,
  shortenPathBy: number = 0,
  handlePrefix: string = "",
):
  | [string, number, number, number, number]
  | [null, null, null, null, null] => {
  const sourceNode = useStore(
    useCallback(
      (store) => store.nodeInternals.get(sourceNodeId),
      [sourceNodeId],
    ),
  );
  const targetNode = useStore(
    useCallback(
      (store) => store.nodeInternals.get(targetNodeId),
      [targetNodeId],
    ),
  );

  if (!sourceNode || !targetNode) {
    return [null, null, null, null, null];
  }

  // we mix const and let assigments, eslint will complain in both cases
  let { sx, sy, tx, ty } = getErEdgeParams(
    sourceNode,
    targetNode,
    handlePrefix,
  );

  const angle = Math.atan2(ty - sy, tx - sx);
  const dist = Math.sqrt((tx - sx) ** 2 + (ty - sy) ** 2);
  const labelDist = dist / 2;
  const labelX = sx + labelDist * Math.cos(angle);
  const labelY = sy + labelDist * Math.sin(angle);

  const roleDist = dist / 5;
  const roleLabelX = sx + roleDist * Math.cos(angle);
  const roleLabelY = sy + roleDist * Math.sin(angle);

  if (shortenPathBy !== 0) {
    // we need to shorten the path so the arrowhead looks good
    tx = sx + (dist - shortenPathBy) * Math.cos(angle);
    ty = sy + (dist - shortenPathBy) * Math.sin(angle);
  }

  const [edgePath] = getStraightPath({
    sourceX: sx,
    sourceY: sy,
    targetX: tx,
    targetY: ty,
  });

  return [edgePath, labelX, labelY, roleLabelX, roleLabelY];
};
