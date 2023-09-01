import Editor, { useMonaco } from "@monaco-editor/react";
import { ErrorMessage } from "../../types/ErrorMessage";
import { Dispatch, useRef } from "react";
import * as monaco from "monaco-editor";
import { getERDoc } from "../../../ERDoc";
import getErrorMessage from "../../util/errorMessages";
import { useTranslations } from "next-intl";
import { ER } from "../../../ERDoc/types/parser/ER";

type EditorProps = {
  onErDocChange: Dispatch<ER>;
  onSemanticErrorMessagesChange: Dispatch<ErrorMessage[]>;
};

const CodeEditor = ({
  onErDocChange,
  onSemanticErrorMessagesChange,
}: EditorProps) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const thisEditor = useMonaco();

  const semanticErrT = useTranslations("home.codeEditor.semanticErrorMessages");

  const setEditorErrors = (errorMessages: ErrorMessage[]) => {
    if (!editorRef.current) return;

    const errors: monaco.editor.IMarkerData[] = errorMessages.map((err) => ({
      startLineNumber: err.location.start.line,
      startColumn: err.location.start.column,
      endLineNumber: err.location.end.line,
      endColumn: err.location.end.column,
      message: err.errorMessage,
      severity: monaco.MarkerSeverity.Error,
    }));

    thisEditor?.editor.setModelMarkers(
      editorRef.current.getModel()!,
      "errors",
      errors,
    );
  };

  const handleEditorContent = (content: string) => {
    try {
      const [erDoc, errors] = getERDoc(content!);
      onErDocChange(erDoc);
      const errorMsgs: ErrorMessage[] = errors.map((err) => ({
        errorMessage: getErrorMessage(semanticErrT, err),
        location: err.location,
      }));
      setEditorErrors(errorMsgs);
      onSemanticErrorMessagesChange(errorMsgs);
    } catch (e) {
      // TODO: Syntax errors
      return;
    }
  }

  return (
    <Editor
      height="100%"
      value={DEFAULT_ERDOC}
      onChange={(content, _) => handleEditorContent(content!) }
      onMount={(editor, _) => {
        editorRef.current = editor;
        handleEditorContent(DEFAULT_ERDOC);
      }}
      theme="vs-dark"
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
