"use client";
import { PanelGroup, Panel } from "react-resizable-panels";
import CodeEditor from "./CodeEditor/CodeEditor";
import { PanelResizeHandle } from "react-resizable-panels";
import { ErDiagram } from "./ErDiagram/ErDiagram";
import { Box } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { ER } from "../../ERDoc/types/parser/ER";
import { erDocWithoutLocation } from "../util/common";

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
        <Box
          height={"full"}
          width={"full"}
          display={"flex"}
          flexDir={"column"}
          overflow={"hidden"}
        >
          <CodeEditor
            onErDocChange={onErDocChange}
            onErrorChange={setErDocHasError}
          />
        </Box>
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
        <Box pt={1} height="full">
          <ErDiagram erDoc={erDoc!} erDocHasError={erDocHasError} />
        </Box>
      </Panel>
    </PanelGroup>
  );
};

export default Body;
