import { Node } from "reactflow";
import { Relationship } from "../../ERDoc/types/parser/Relationship";
import ArrowNotation from "../components/ErDiagram/notations/ArrowNotation/ArrowNotation";
import MinMaxNotation from "../components/ErDiagram/notations/MinMaxNotation/MinMaxNotation";
import { toSvg } from "html-to-image";
import ChenNotation from "../components/ErDiagram/notations/ChenNotation/ChenNotation";
import { ER } from "../../ERDoc/types/parser/ER";

export const createRelationshipId = (relationship: Relationship): string => {
  // relationships are identified by their name and attributes, so we need all this info to generate a unique ID.
  return `${relationship.name}$${relationship.participantEntities
    .map((part) => part.entityName)
    .sort()
    .join("$")}`;
};

export const createEntityNodeId = (entityName: string): string => {
  return `entity: ${entityName}`;
};

export const createRelationshipNodeId = (relationshipId: string): string => {
  return `relationship: ${relationshipId}`;
};

export type LayoutedNode = Node & { x: number; y: number };

export const updateNodePosition = (
  node: LayoutedNode,
  nodes: LayoutedNode[],
  adjustAnchor: boolean = false,
): LayoutedNode => {
  if (adjustAnchor) {
    node.x -= node.width! / 2;
    node.y -= node.height! / 2;
  }
  const parentNode = nodes.find((n) => n.id === node.parentNode);
  if (parentNode) {
    node.x = node.x - parentNode.x;
    node.y = node.y - parentNode.y;
  }
  return { ...node, position: { x: node.x, y: node.y } };
};

const HANDLE_PREFIXES = ["1", "2", "3", "4"] as const;
export const getHandlePrefix = (edgeId: string) => {
  let handlePrefix = "";
  if (HANDLE_PREFIXES.find((prefix) => prefix === edgeId[0])) {
    handlePrefix = edgeId[0];
  }
  return handlePrefix;
};

export const notations = {
  arrow: ArrowNotation,
  minmax: MinMaxNotation,
  chen: ChenNotation,
};

export type NotationTypes = keyof typeof notations;

export type DownloadFunc = (
  w: number,
  h: number,
  transparentBg: boolean,
) => void;

export const downloadImage = (dataUrl: string, fileExtension: string) => {
  const a = document.createElement("a");
  a.setAttribute("download", `er_diagram.${fileExtension}`);
  a.setAttribute("href", dataUrl);
  a.click();
};

export const exportToPDF = async (width: number, height: number) => {
  // Get the DOM element
  const flow = document.querySelector(".react-flow__viewport");
  // Convert to SVG
  // @ts-ignore
  const svgContent = await toSvg(flow!);
  console.log("Hello?");
  const svgElement = decodeURIComponent(
    svgContent.replace("data:image/svg+xml;charset=utf-8,", "").trim(),
  );
  // Open new window
  const newWindow = open();
  // Write our page content to the newly opened page
  newWindow?.document.write(
    `<html>
                    <head>
                        <title>ER Diagram</title>
                        <style type="text/css" media="print">
                          @page { size: landscape; }
                        </style>
                        <style>
                            body {
                                width: ${width.toString()} px;
                                height: ${height.toString()} px;
                                margin: auto
                            }
                            .container {
                                 background: #393D43;
                                text-align: center;
                                height: 100%;
                                 width: 100%;
                            }
                            
                            @page {
                                margin:0 !important;
                            }
                            @media print {

                                * {
                                    -webkit-print-color-adjust: exact !important;
                                    color-adjust: exact !important;
                                }
                                .container {
                                    background: none;
                                }
                            }
                        </style>
                    </head>
                    <body>
                        <div class='container'>
                            <div class='svg-container'>
                                ${svgElement}
                            </div>
                            
                            <script>
                                document.close();
                                window.print();
                            </script>
                        </div>
                    </body>
                </html>`,
  );
};

export const erDocWithoutLocation = (erDoc: ER) => {
  return {
    entities: erDoc.entities.map((entity) => ({
      ...entity,
      attributes: entity.attributes.map((attr) => ({
        ...attr,
        location: undefined,
      })),
      location: undefined,
    })),

    relationships: erDoc.relationships.map((relationship) => ({
      ...relationship,
      location: undefined,
      attributes: relationship.attributes.map((attr) => ({
        ...attr,
        location: undefined,
      })),
      participantEntities: relationship.participantEntities.map((part) => ({
        ...part,
        location: undefined,
      })),
    })),

    aggregations: erDoc.aggregations.map((agg) => ({
      ...agg,
      location: undefined,
    })),
  };
};
