import { Box, Spinner } from "@chakra-ui/react";
import Editor, { OnMount, useMonaco } from "@monaco-editor/react";
import { editor, languages } from "monaco-types";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { getERDoc } from "../../../ERDoc";
import { ER } from "../../../ERDoc/types/parser/ER";
import { ErrorMessage, MarkerSeverity } from "../../types/CodeEditor";
import { EXAMPLES } from "../../util/ErdocExamples";
import { colors } from "../../util/colors";
import getErrorMessage from "../../util/errorMessages";
import ErrorTable from "./ErrorTable";
import ExamplesTable from "./ExamplesTable";

type ErrorReportingEditorProps = {
  onErDocChange: (er: ER) => void;
};

const editorThemes: [themeName: string, theme: editor.IStandaloneThemeData][] =
  [
    [
      "onedark",
      {
        base: "vs-dark",
        inherit: true,
        rules: [
          { token: "keyword", foreground: colors.textEditorAccent },
          { token: "string", foreground: "#98c379" },
        ],
        colors: {
          "editor.background": colors.textEditorBackground,
        },
      },
    ],
  ];

const DEFAULT_THEME = "onedark";

const erdocConfig: languages.LanguageConfiguration = {
  surroundingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
  ],
  autoClosingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
  ],
};

const erdocTokenizer: languages.IMonarchLanguage = {
  keywords: ["entity", "relation", "aggregation", "depends on", "extends"],
  keyKeywords: ["key", "pkey"],
  ignoreCase: true,
  tokenizer: {
    root: [
      // identifiers and keywords
      [
        /depends[ ]on|[a-z_][\w]*/,
        {
          cases: {
            "@keywords": "keyword",
            "@keyKeywords": "string",
          },
        },
      ],

      [
        /\w+\s\w+/,
        {
          cases: {
            "@keywords": "keyword",
          },
        },
      ],
    ],
  },
};

const INITIAL_CONTENT = EXAMPLES["bank"];

const CodeEditor = ({ onErDocChange }: ErrorReportingEditorProps) => {
  const [selectedExample, setSelectedExample] = useState<string | null>(null);

  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const thisEditor = useMonaco();

  const semanticErrT = useTranslations("home.codeEditor.semanticErrorMessages");

  const [semanticErrorMessages, setSemanticErrorMessages] = useState<
    ErrorMessage[]
  >([]);

  const setEditorErrors = (
    errorMessages: ErrorMessage[],
    severity: MarkerSeverity,
  ) => {
    if (!editorRef.current) return;

    const errors: editor.IMarkerData[] = errorMessages.map((err) => ({
      startLineNumber: err.location.start.line,
      startColumn: err.location.start.column,
      endLineNumber: err.location.end.line,
      endColumn: err.location.end.column,
      message: err.errorMessage,
      severity,
    }));

    thisEditor?.editor.setModelMarkers(
      editorRef.current.getModel()!,
      "semanticErrors",
      errors,
    );
  };

  const handleEditorContent = (content: string) => {
    try {
      const [erDoc, errors] = getERDoc(content);
      onErDocChange(erDoc);
      const errorMsgs: ErrorMessage[] = errors.map((err) => ({
        errorMessage: getErrorMessage(semanticErrT, err),
        location: err.location,
      }));
      setEditorErrors(errorMsgs, MarkerSeverity.Error);
      setSemanticErrorMessages(errorMsgs);
    } catch (e) {
      setEditorErrors(
        [
          {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
            errorMessage: e.message,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
            location: e.location,
          },
        ],
        MarkerSeverity.Error,
      );
    }
  };

  const handleEditorMount: OnMount = (editor, m) => {
    editorRef.current = editor;
    handleEditorContent(INITIAL_CONTENT);
    // mount erdoc language
    m.languages.register({ id: "erdoc" });
    m.languages.setMonarchTokensProvider("erdoc", erdocTokenizer);
    m.languages.setLanguageConfiguration("erdoc", erdocConfig);
    // custom themes
    for (const [themeName, theme] of editorThemes) {
      m.editor.defineTheme(themeName, theme);
    }
    m.editor.setTheme(DEFAULT_THEME);
    editor.setValue(INITIAL_CONTENT);
  };

  useEffect(() => {
    if (editorRef.current && selectedExample !== null) {
      // sets the editor content to the clicked example, making it ctrl+z-able
      editorRef.current.pushUndoStop();
      editorRef.current.executeEdits("replaced for example", [
        {
          range: editorRef.current.getModel()!.getFullModelRange(),
          text: selectedExample,
        },
      ]);
      editorRef.current.pushUndoStop();
      setSelectedExample(null);
    }
  }, [selectedExample, editorRef]);

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
        {
          <Editor
            height={"100%"}
            // value={initialContent}
            onChange={(content, _) => handleEditorContent(content!)}
            onMount={handleEditorMount}
            loading={<Spinner color="white" />}
            language="erdoc"
            options={{
              autoClosingBrackets: "always",
              scrollBeyondLastLine: false,
              minimap: {
                enabled: false,
              },
            }}
          />
        }
      </Box>

      <Box
        height={"max-content"}
        maxHeight={"30%"}
        backgroundColor={colors.textEditorBackground}
      >
        <ErrorTable errors={semanticErrorMessages} />
      </Box>
      <Box
        height={"max-content"}
        maxHeight={"30%"}
        backgroundColor={colors.textEditorBackground}
      >
        <ExamplesTable onExampleClick={(t) => setSelectedExample(t)} />
      </Box>
    </Box>
  );
};

export default CodeEditor;
