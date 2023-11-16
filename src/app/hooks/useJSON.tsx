import { useMonaco } from "@monaco-editor/react";
import { useContext } from "react";
import { useReactFlow } from "reactflow";
import { Context } from "../context";
import { ErDocChangeEvent } from "../types/CodeEditor";

export type ErJSON = {
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

export const useJSON = (onErDocChange: (evt: ErDocChangeEvent) => void) => {
  const { getNodes, getEdges } = useReactFlow();
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

    const json: ErJSON = {
      erDoc: editorValue!,
      nodes,
      edges,
    };

    exportObject(json, filename);
  };

  const importJSON = (
    json: ErJSON,
    monacoInstance?: ReturnType<typeof useMonaco>,
  ) => {
    const editorText = json.erDoc;
    // first, turn off auto layout
    setAutoLayoutEnabled(false);
    // set the text in monaco
    if (monacoInstance) {
      monacoInstance.editor.getModels()[0].setValue(editorText);
    } else {
      monaco?.editor.getModels()[0].setValue(editorText);
    }
    onErDocChange({
      type: "json",
      positions: {
        nodes: json.nodes,
        edges: json.edges,
      },
    });
  };

  return { exportToJSON, importJSON };
};
