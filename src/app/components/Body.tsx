"use client";
import { useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { ER } from "../../ERDoc/types/parser/ER";
import { erDocWithoutLocation } from "../util/common";
import CodeEditor from "./CodeEditor/CodeEditor";
import { ErDiagram } from "./ErDiagram/ErDiagram";

const Body = () => {
  const [erDoc, setErDoc] = useState<ER | null>(null);
  const [erDocHasError, setErDocHasError] = useState<boolean>(false);
  const [dragging, setDragging] = useState<boolean>(false);

  const onErDocChange = (er: ER) => {
    setErDoc((currentEr) => {
      if (currentEr === null) return er;
      const currentErNoLoc = erDocWithoutLocation(currentEr);
      const newErNoLoc = erDocWithoutLocation(er);
      const sameSemanticValue =
        JSON.stringify(currentErNoLoc) === JSON.stringify(newErNoLoc);
      return sameSemanticValue ? currentEr : er;
    });
  };

  return (
    <PanelGroup direction="horizontal">
      <Panel defaultSize={40} minSize={25}>
        <div className="flex h-full w-full flex-col overflow-hidden">
          <CodeEditor
            onErDocChange={onErDocChange}
            onErrorChange={setErDocHasError}
          />
        </div>
      </Panel>
      <PanelResizeHandle
        className={`relative w-1 ${dragging ? "bg-secondary" : "bg-primary"}`}
        onDragging={(isDragging) => {
          setDragging(isDragging);
        }}
      >
        <div className="h-full w-1 bg-primary hover:bg-secondary"></div>
      </PanelResizeHandle>
      <Panel defaultSize={60}>
        <div className="h-full pt-1">
          <ErDiagram erDoc={erDoc!} erDocHasError={erDocHasError} />
        </div>
      </Panel>
    </PanelGroup>
  );
};

export default Body;
