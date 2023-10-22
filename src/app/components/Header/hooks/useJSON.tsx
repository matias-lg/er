import { useMonaco } from "@monaco-editor/react";
import { useCallback, useContext } from "react";
import { useReactFlow, useNodesInitialized } from "reactflow";
import { Context } from "../../../context";

export type ValidJSON = {
  erDoc: string;

  nodes: {
    id: string;
    position: {
      x: number;
      y: number;
    };
  }[];

  edges: {
    id: string;
    source: string;
    target: string;
  }[];
};

const exportObject = (object: any, filename: string) => {
  const contentType = "application/json;charset=utf-8;";
  const a = document.createElement("a");
  a.download = filename;
  a.href =
    "data:" +
    contentType +
    "," +
    encodeURIComponent(JSON.stringify(object, null, 2));
  a.target = "_blank";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

export const useJSON = () => {
  const { getNodes, getEdges, setNodes, fitView } = useReactFlow();
  const monaco = useMonaco();
  const { setAutoLayoutEnabled } = useContext(Context);

  const exportToJSON = () => {
    const filename = "er-diagram.json";
    // save only ids and positions
    const nodes = getNodes().map((node) => ({
      id: node.id,
      position: node.position,
    }));

    const edges = getEdges().map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
    }));
    const editorValue = monaco?.editor.getModels()[0].getValue();

    const json: ValidJSON = {
      erDoc: editorValue!,
      nodes,
      edges,
    };

    exportObject(json, filename);
  };

  const importJSON = (json: ValidJSON) => {
    const editorText = json.erDoc;
    // first, turn off auto layout
    setAutoLayoutEnabled(false);
    // set the text in monaco
    monaco?.editor.getModels()[0].setValue(editorText);
    // this will trigger the onChange event and update the erDoc, now we need to update the saved positions
    setNodes((nodes) => {
      return nodes.map((node) => {
        const savedNode = json.nodes.find((n) => n.id === node.id);
        if (savedNode) {
          return {
            ...node,
            position: savedNode.position,
          };
        } else return node;
      });
    });
  };

  return { exportToJSON, importJSON };
};
