import { useMonaco } from "@monaco-editor/react";
import { useContext } from "react";
import { useReactFlow } from "reactflow";
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
  const { setAutoLayoutEnabled, setLoadedDiagramFromOutside } =
    useContext(Context);

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
    // HACK: setting the editor value will trigger an OnChange event which will cause the
    // ER Diagram to be updated to the nodes with default positions, we need to wait for that
    // to happen and then update the positions. There's probably a better way to do this.
    setTimeout(() => {
      setLoadedDiagramFromOutside(true);
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
    }, 1);
  };

  return { exportToJSON, importJSON };
};
