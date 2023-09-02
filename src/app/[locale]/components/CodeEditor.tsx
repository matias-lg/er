import Editor, { useMonaco } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { useTranslations } from "next-intl";
import { Dispatch, useRef } from "react";
import { getERDoc } from "../../../ERDoc";
import { ER } from "../../../ERDoc/types/parser/ER";
import { ErrorMessage } from "../../types/ErrorMessage";
import getErrorMessage from "../../util/errorMessages";

type EditorProps = {
  onErDocChange: Dispatch<ER>;
  onSemanticErrorMessagesChange: Dispatch<ErrorMessage[]>;
};

const editor_tokenizer: monaco.languages.IMonarchLanguage = {
  keywords: ["entity", "relation", "aggregation", "depends on", "extends"],
  keyKeywords: ["key", "pkey"],
  keywordsRegex: /entity|relation|aggregation|depends on|extends/,
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

const CodeEditor = ({
  onErDocChange,
  onSemanticErrorMessagesChange,
}: EditorProps) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const thisEditor = useMonaco();

  const semanticErrT = useTranslations("home.codeEditor.semanticErrorMessages");

  const setEditorErrors = (
    errorMessages: ErrorMessage[],
    severity: monaco.MarkerSeverity,
  ) => {
    if (!editorRef.current) return;

    const errors: monaco.editor.IMarkerData[] = errorMessages.map((err) => ({
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
      setEditorErrors(errorMsgs, monaco.MarkerSeverity.Error);
      onSemanticErrorMessagesChange(errorMsgs);
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
        monaco.MarkerSeverity.Error,
      );
    }
  };

  const handleEditorMount = (
    editor: monaco.editor.IStandaloneCodeEditor,
    m: typeof monaco,
  ) => {
    editorRef.current = editor;
    handleEditorContent(DEFAULT_ERDOC);
    // mount erdoc tokenizer
    m.languages.register({ id: "erdoc" });
    m.languages.setMonarchTokensProvider("erdoc", editor_tokenizer);
    // custom theme
    m.editor.defineTheme("onedark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "keyword", foreground: "#c678dd" },
        { token: "string", foreground: "#98c379" },
      ],
      colors: {
        "editor.background": "#21252b",
      },
    });
    m.editor.setTheme("onedark");
  };

  return (
    <Editor
      height={"100%"}
      value={DEFAULT_ERDOC}
      onChange={(content, _) => handleEditorContent(content!)}
      onMount={handleEditorMount}
      // theme="vs-dark"
      language="erdoc"
      options={{
        scrollBeyondLastLine: false,
        minimap: {
          enabled: false,
        },
      }}
    />
  );
};

export default CodeEditor;

const DEFAULT_ERDOC = `
entity bank {
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

relation accts(bank_branch 1, account N!)
relation loans(bank_branch 1, loan N!)

entity customer {
    ssn key
    name
    addr
    phone
}

relation a_c(customer N, account M!)
relation l_c(customer N, loan M!)

`;
