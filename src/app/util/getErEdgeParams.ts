import { Position, internalsSymbol, Node } from "reactflow";

// returns the position (top,right,bottom or right) passed node compared to

/*
// TODO: Get handle coords by position and ID. We will have multiple handles per Position. 
----------------
|              |
|relation. node|
|              |
----------------
H      H       H  
^      ^        ^
|      |        | rh
|      | mh
|lh

lh and rh are the handles used when an entity has total participation in a relationship
so every side of the nodes will have 3 handles. We will route the handles only to their
corresponding handles, e.g: the left handle of the bottom side of a node must only be
connected to another left handle.
*/

function getParams(nodeA: Node, nodeB: Node) {
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

  const [x, y] = getHandleCoordsByPosition(nodeA, position);
  return [x, y, position];
}

function getHandleCoordsByPosition(
  node: Node,
  handlePosition: Position,
): number[] {
  let handle = node[internalsSymbol]?.handleBounds?.source?.find(
    (h) => h.position === handlePosition,
  );
  if (handle === undefined)
    handle = node[internalsSymbol]?.handleBounds?.target?.find(
      (h) => h.position === handlePosition,
    );

  const offsetX = handle!.width / 2;
  const offsetY = handle!.height / 2;

  const x = node.positionAbsolute!.x + handle!.x + offsetX;
  const y = node.positionAbsolute!.y + handle!.y + offsetY;

  return [x, y];
}

function getNodeCenter(node: Node) {
  return {
    x: node.positionAbsolute!.x + node.width! / 2,
    y: node.positionAbsolute!.y + node.height! / 2,
  };
}

// returns the parameters (sx, sy, tx, ty, sourcePos, targetPos) you need to create an edge
export function getErEdgeParams(source: Node, target: Node) {
  const [sx, sy, sourcePos] = getParams(source, target);
  const [tx, ty, targetPos] = getParams(target, source);

  return {
    sx,
    sy,
    tx,
    ty,
    sourcePos,
    targetPos,
  } as {
    sx: number;
    sy: number;
    tx: number;
    ty: number;
    sourcePos: Position;
    targetPos: Position;
  };
}