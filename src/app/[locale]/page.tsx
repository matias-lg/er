"use client";
import { useState } from "react";
import { ER } from "../../ERDoc/types/parser/ER";
import { Grid, GridItem, Box } from "@chakra-ui/react";
import ErrorTable from "./components/ErrorTable";
import { colors } from "../util/colors";
import Header from "./components/Header";
import ErDiagram from "./components/ErDiagram";
import CodeEditor from "./components/CodeEditor";
import { ErrorMessage } from "../types/ErrorMessage";

const Page = () => {
  const [erDoc, setErDoc] = useState<ER | null>(null);
  const [semanticErrorMessages, setSemanticErrorMessages] = useState<
    ErrorMessage[]
  >([]);

  return (
    <Grid
      templateAreas={`
     " header header"
     "textZone erd"
    `}
      gridTemplateRows={"5% auto"}
      gridTemplateColumns={"35% 65%"}
      h="100%"
      gap="0"
    >
      <GridItem padding={0} area="header">
        <Header />
      </GridItem>

      <GridItem
        m={0}
        p={0}
        area={"textZone"}
        display={"flex"}
        h={"100%"}
        flexDir={"column"}
        overflow={"hidden"}
        justifyContent={"space-between"}
      >
        <Box
          resize="none"
          width="full"
          height="full"
          overflow="auto"
          bg={colors.textEditorBackground}
          pt={2}
        >
          <CodeEditor
            onErDocChange={setErDoc}
            onSemanticErrorMessagesChange={setSemanticErrorMessages}
          />
        </Box>

        <Box width="full" height="fit-content" maxH={"40%"} overflow="hidden">
          <ErrorTable semanticErrorMessages={semanticErrorMessages} />
        </Box>
      </GridItem>

      <GridItem area="erd">
        <Box width="full" height="full">
          <ErDiagram erDoc={erDoc!} />
        </Box>
      </GridItem>
    </Grid>
  );
};
export default Page;
