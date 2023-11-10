import { Box, Spinner } from "@chakra-ui/react";
import Editor, { OnMount, useMonaco } from "@monaco-editor/react";
import { editor, languages } from "monaco-types";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { getERDoc } from "../../../ERDoc";
import { ER } from "../../../ERDoc/types/parser/ER";
import { ErrorMessage, MarkerSeverity } from "../../types/CodeEditor";
import { colors } from "../../util/colors";
import getErrorMessage from "../../util/errorMessages";
import { EditorHeader } from "./EditorHeader";
import ExamplesTable from "./ExamplesTable";
import ErrorTable from "./ErrorTable";

type ErrorReportingEditorProps = {
  onErDocChange: (er: ER) => void;
  onErrorChange: (hasError: boolean) => void;
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

const LOCAL_STORAGE_EDITOR_CONTENT_KEY = "monaco-editor-content";

const CodeEditor = ({
  onErDocChange,
  onErrorChange,
}: ErrorReportingEditorProps) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const thisEditor = useMonaco();

  const semanticErrT = useTranslations("home.codeEditor.semanticErrorMessages");

  const [errorMessages, setErrorMessages] = useState<ErrorMessage[]>([]);

  const setEditorErrors = (
    errorMessages: ErrorMessage[],
    severity: MarkerSeverity,
    monacoInstance: ReturnType<typeof useMonaco>,
  ) => {
    if (!editorRef.current) return;
    console.log("Setting editor errors", errorMessages);

    const errors: editor.IMarkerData[] = errorMessages.map((err) => ({
      startLineNumber: err.location.start.line,
      startColumn: err.location.start.column,
      endLineNumber: err.location.end.line,
      endColumn: err.location.end.column,
      message: err.errorMessage,
      severity,
    }));
    monacoInstance?.editor.setModelMarkers(
      editorRef.current.getModel()!,
      "semanticErrors",
      errors,
    );
  };

  const handleEditorContent = (
    content: string,
    monacoInstance = thisEditor,
  ) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_EDITOR_CONTENT_KEY, content);
      const [erDoc, errors] = getERDoc(content);
      onErrorChange(errors.length > 0);
      onErDocChange(erDoc);
      const errorMsgs: ErrorMessage[] = errors.map((err) => ({
        errorMessage: getErrorMessage(semanticErrT, err),
        location: err.location,
      }));
      setEditorErrors(errorMsgs, MarkerSeverity.Error, monacoInstance);
      setErrorMessages(errorMsgs);
    } catch (e) {
      onErrorChange(true);
      const syntaxErrorMessage = {
        errorMessage: e.message,
        location: e.location,
      };
      setErrorMessages([syntaxErrorMessage]);
      setEditorErrors(
        [syntaxErrorMessage],
        MarkerSeverity.Error,
        monacoInstance,
      );
    }
  };

  const handleEditorMount: OnMount = (editor, monacoInstance) => {
    editorRef.current = editor;
    const prevContent = localStorage.getItem(LOCAL_STORAGE_EDITOR_CONTENT_KEY);
    const initialContent = prevContent ?? DEFAULT_CONTENT;
    editor.setValue(initialContent);
    handleEditorContent(initialContent, monacoInstance);
    // mount erdoc language
    monacoInstance.languages.register({ id: "erdoc" });
    monacoInstance.languages.setMonarchTokensProvider("erdoc", erdocTokenizer);
    monacoInstance.languages.setLanguageConfiguration("erdoc", erdocConfig);
    // custom themes
    for (const [themeName, theme] of editorThemes) {
      monacoInstance.editor.defineTheme(themeName, theme);
    }
    monacoInstance.editor.setTheme(DEFAULT_THEME);
  };

  return (
    <Box
      height={"full"}
      width={"full"}
      display={"flex"}
      flexDir={"column"}
      overflow={"hidden"}
    >
      <EditorHeader editorRef={editorRef} />
      <Box
        resize="none"
        pt={0}
        flex={"1 1 auto"}
        width="full"
        height="max-content"
        overflow="hidden"
        bg={colors.textEditorBackground}
      >
        <Editor
          height={"100%"}
          onChange={(content, _evt) => handleEditorContent(content!)}
          onMount={handleEditorMount}
          loading={<Spinner color="white" />}
          language="erdoc"
          options={{
            autoClosingBrackets: "always",
            scrollBeyondLastLine: false,
            fixedOverflowWidgets: true,
            minimap: {
              enabled: false,
            },
          }}
        />
      </Box>

      <Box
        height={"max-content"}
        maxHeight={"30%"}
        backgroundColor={colors.textEditorBackground}
      >
        <ErrorTable errors={errorMessages} />
      </Box>
      <Box
        height={"max-content"}
        maxHeight={"30%"}
        backgroundColor={colors.textEditorBackground}
      >
        <ExamplesTable />
      </Box>
    </Box>
  );
};

export default CodeEditor;

const DEFAULT_CONTENT = `entity bank {
    code key
    name
    addr
}

entity bank_branch depends on has_branches {
    addr
    branch_no pkey
}

relation has_branches(bank 1!, bank_branch N!)

entity account {
    acct_no key
    balance
    type
}

entity loan {
    loan_no key
    amount
    type
}

relation accts(Bank_With_Branches 1, account N!)
relation loans(Bank_With_Branches 1, loan N!)

entity customer {
    ssn key
    name
    addr
    phone
}

entity premium_customer extends customer {
    discount
}

relation a_c(customer N, account M!)
relation l_c(customer N, loan M!)

aggregation Bank_With_Branches(has_branches)`;
