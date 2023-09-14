"use client";
import { useState } from "react";
import { ER } from "../../ERDoc/types/parser/ER";
import { Grid, GridItem, Box } from "@chakra-ui/react";
import { colors } from "../util/colors";
import Header from "../components/Header";
import { ErDiagram } from "../components/ErDiagram/ErDiagram";
import ErrorReportingEditor from "../components/ErrorReportingEditor/ErrorReportingEditor";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";

const Page = () => {
  const [erDoc, setErDoc] = useState<ER | null>(null);

  return (
    <Grid
      templateAreas={`
     "header"
     "main"
    `}
      gridTemplateRows={"5% auto"}
      h="100%"
      gap="0"
    >
      <GridItem
        mb={0}
        textColor={"white"}
        display={"flex"}
        justifyContent={"between"}
        paddingY={2}
        paddingX={4}
        flex={"wrap"}
        backgroundColor={colors.textEditorBackground}
        borderBottom={"1px"}
        borderBottomColor={"rgb(248 250 252 / 0.16)"}
        area="header"
      >
        <Header />
      </GridItem>

      <GridItem
        overflow={"hidden"}
        area={"main"}
        display={"flex"}
        w={"100%"}
        flexDir={"row"}
        justifyContent={"space-between"}
      >
        <PanelGroup direction="horizontal">
          <Panel defaultSize={40} minSize={25}>
            <Box
              height={"full"}
              width={"full"}
              display={"flex"}
              flexDir={"column"}
              overflow={"hidden"}
            >
              <ErrorReportingEditor onErDocChange={setErDoc} />
            </Box>
          </Panel>
          <PanelResizeHandle className="w-[1px] px-[1px]" />
          <Panel defaultSize={60}>
            <Box pt={1} height="full">
              <ErDiagram erDoc={erDoc!} />
            </Box>
          </Panel>
        </PanelGroup>
      </GridItem>
    </Grid>
  );
};

export default Page;
