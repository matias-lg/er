"use client";
import { PanelGroup, Panel } from "react-resizable-panels";
import CodeEditor from "./CodeEditor/CodeEditor";
import { PanelResizeHandle } from "react-resizable-panels";
import { ErDiagram } from "./ErDiagram/ErDiagram";
import { Box } from "@chakra-ui/react";
import { useState } from "react";
import { ER } from "../../ERDoc/types/parser/ER";

const Body = () => {
  const [erDoc, setErDoc] = useState<ER | null>(null);
  const [dragging, setDragging] = useState<boolean>(false);
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
          <CodeEditor onErDocChange={setErDoc} />
        </Box>
      </Panel>
      <PanelResizeHandle
        className={`relative w-1 ${
          dragging ? "bg-secondary" : "bg-primary"
        }`}
        onDragging={(isDragging) => {
          setDragging(isDragging);
        }}
      >
        <div className="h-full w-1 hover:bg-secondary bg-primary"></div>
      </PanelResizeHandle>
      <Panel defaultSize={60}>
        <Box pt={1} height="full">
          <ErDiagram erDoc={erDoc!} />
        </Box>
      </Panel>
    </PanelGroup>
  );
};

export default Body;
