import { Box } from "@chakra-ui/react";
import { useState } from "react";
import { ER } from "../../../ERDoc/types/parser/ER";
import { ErrorMessage } from "../../types/ErrorMessage";
import { colors } from "../../util/colors";
import CodeEditor from "./CodeEditor";
import ErrorTable from "./ErrorTable";

type ErrorReportingEditorProps = {
  onErDocChange: (er: ER) => void;
};

const ErrorReportingEditor = ({ onErDocChange }: ErrorReportingEditorProps) => {
  const [semanticErrorMessages, setSemanticErrorMessages] = useState<
    ErrorMessage[]
  >([]);
  return (
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
          onErDocChange={onErDocChange}
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
  );
};

export default ErrorReportingEditor;
