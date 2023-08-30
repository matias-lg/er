import getErrorMessage from "../util/errorMessages";
import { SemanticError } from "../../ERDoc/types/linter/SemanticError";
import { useTranslations } from "next-intl";
import {
  ListItem,
  UnorderedList,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
} from "@chakra-ui/react";
import { colors } from "../util/colors";

type ErrorTableProps = {
  hasSyntaxError: boolean;
  syntaxError: Error | null;
  semanticErrors: SemanticError[];
};

const ErrorTable = ({
  hasSyntaxError,
  syntaxError,
  semanticErrors,
}: ErrorTableProps) => {
  const t = useTranslations("home.errorsTable");
  const semanticT = useTranslations("home.errorsTable.semanticErrorMessages");
  return (
    <Accordion
      allowToggle
      defaultIndex={0}
      maxHeight={"800px"}
      // overflow={"hidden"}
      border={0}
      borderTopColor={"#6b7280"}
      borderBottomColor={"#6b7280"}
    >
      <AccordionItem
        backgroundColor={colors.textEditorBackground}
        maxHeight={"full"}
        overflow={"hidden"}
      >
        <AccordionButton textColor={"#a8a29e"}>
          <Box as="span" flex="1" textAlign="left">
            {t("errors")}{" "}
            {semanticErrors.length > 0 ? `(${semanticErrors.length})` : ""}
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel
          textColor={"#a8a29e"}
          maxHeight={"390px"}
          overflow={"hidden"}
        >
          <div className={"overflow-auto max-h-[250px]"}>
            <UnorderedList height={"full"}>
              {hasSyntaxError && (
                <ListItem>{JSON.stringify(syntaxError)}</ListItem>
              )}
              {semanticErrors.map((err, idx) => (
                <ListItem key={idx}>
                  {getErrorMessage(semanticT, err)} ({err.location.start.line}:
                  {err.location.start.column})
                </ListItem>
              ))}
            </UnorderedList>
          </div>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default ErrorTable;
