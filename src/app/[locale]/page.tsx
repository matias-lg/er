"use client";
import { useEffect, useState } from "react";
import { getERDoc } from "../../ERDoc";
import CodeEditor from "./components/CodeEditor";
import { SemanticError } from "../../ERDoc/types/linter/SemanticError";
import { ER } from "../../ERDoc/types/parser/ER";
import { Grid, GridItem, Card, CardBody, Box } from "@chakra-ui/react";
import ErrorTable from "./components/ErrorTable";

const Page = () => {
  const [_, setERDoc] = useState<ER | null>(null);
  const [inputText, setInputText] = useState<string>(DEFAULT_ERDOC_STR);

  const [semanticErrors, setSemanticErrors] = useState<SemanticError[]>([]);

  const [hasSyntaxError, setHasSyntaxError] = useState<boolean>(false);
  const [syntaxError, setSyntaxError] = useState<Error | null>(null);
  const [errorTableIsOpen, setErrorTableIsOpen] = useState<boolean>(true);

  useEffect(() => {
    try {
      setHasSyntaxError(false);
      const [erDoc, errors] = getERDoc(inputText);
      setERDoc(erDoc);
      setSemanticErrors(errors);
    } catch (e) {
      setHasSyntaxError(true);
      if (e instanceof Error) setSyntaxError(e);
    }
  }, [inputText]);
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
      <GridItem area="header">"Header goes here"</GridItem>
      <GridItem
        area={"textZone"}
        display={"flex"}
        h={"100%"}
        flexDir={"column"}
        overflow={"hidden"}
        justifyContent={"space-between"}
      >
        <Box resize="none" width='full' height='full' overflow='auto' bg='pink.400' >
          <CodeEditor
              editorText={inputText}
              onEditorTextChange={setInputText}
            />
        </Box>

        <Box width='full' height='fit-content' overflow='hidden' bg='orange.400' >
          <ErrorTable
              isOpen={errorTableIsOpen}
              onClickHandler={() => setErrorTableIsOpen((isOpen) => !isOpen)}
              hasSyntaxError={hasSyntaxError}
              semanticErrors={semanticErrors}
              syntaxError={syntaxError}
            />
        </Box>
      </GridItem>
      <GridItem area="erd">"ER goes here"</GridItem>
    </Grid>
  );
};
export default Page;

const DEFAULT_ERDOC_STR = `
entity milita{}
entity milita{}
entity milita{}
entity milita{}
entity milita{}
entity milita{}
entity milita{}
entity milita{}
entity milita{}
entity milita{}
entity milita{}
entity milita{}
entity milita{}
entity milita{}
entity milita{}
entity milita{}
entity milita{}
entity milita{}
entity milita{}
entity milita{}
`;
