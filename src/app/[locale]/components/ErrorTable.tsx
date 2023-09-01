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
import { colors } from "../../util/colors";
import { ErrorMessage } from "../../types/ErrorMessage";

type ErrorTableProps = {
  semanticErrorMessages: ErrorMessage[];
};

const ErrorTable = ({ semanticErrorMessages }: ErrorTableProps) => {
  const t = useTranslations("home.errorsTable");
  return (
    <Accordion
      allowToggle
      defaultIndex={0}
      borderTopColor={"#6b7280"}
      borderBottomColor={"#6b7280"}
    >
      <AccordionItem backgroundColor={colors.textEditorBackground}>
        <AccordionButton textColor={"#D4D4D4"}>
          <Box as="span" flex="1" textAlign="left">
            {t("errors")}{" "}
            {semanticErrorMessages.length > 0
              ? `(${semanticErrorMessages.length})`
              : ""}
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel textColor={"#D4D4D4"} overflow={"auto"}>
          <UnorderedList>
            {semanticErrorMessages.map((err, idx) => (
              <ListItem key={idx}>
                {err.errorMessage} ({err.location.start.line}:
                {err.location.start.column})
              </ListItem>
            ))}
          </UnorderedList>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default ErrorTable;
