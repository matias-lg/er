"use client";
import { useState } from "react";
import { ER } from "../../ERDoc/types/parser/ER";
import { Grid, GridItem, Box } from "@chakra-ui/react";
import { colors } from "../util/colors";
import Header from "../components/Header";
import ErDiagram from "../components/ErDiagram";
import { ErrorMessage } from "../types/ErrorMessage";
import ErrorTable from "../components/ErrorTable";
import CodeEditor from "../components/CodeEditor";

const Page = () => {
  const [erDoc, setErDoc] = useState<ER | null>(null);
  const [semanticErrorMessages, setSemanticErrorMessages] = useState<
    ErrorMessage[]
  >([]);

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
        <Box
          height={"full"}
          width={"full"}
          display={"flex"}
          flexDir={"column"}
          overflow={"hidden"}
        >
          <Box
            resize="none"
            pt={1}
            flex={"1 1 auto"}
            width="full"
            height="max-content"
            overflow="hidden"
            bg={colors.textEditorBackground}
          >
            <CodeEditor
              onErDocChange={setErDoc}
              onSemanticErrorMessagesChange={setSemanticErrorMessages}
            />
          </Box>

          <Box
            height={"max-content"}
            maxHeight={"30%"}
            backgroundColor={colors.textEditorBackground}
          >
            <ErrorTable errors={semanticErrorMessages} />
          </Box>
        </Box>

        <Box pt={1} width={"150%"} height="full">
          <ErDiagram erDoc={erDoc!} />
        </Box>
      </GridItem>
    </Grid>
  );
};
export default Page;
