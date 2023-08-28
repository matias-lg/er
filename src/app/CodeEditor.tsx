"use client";
import CodeMirror from "@uiw/react-codemirror";
import { useCallback, Dispatch } from "react";

type Props = {
  editorText: string;
  onEditorTextChange: Dispatch<string>;
};

const CodeEditor = ({ editorText, onEditorTextChange }: Props) => {
  const onChange = useCallback(
    (content: string, _: never) => onEditorTextChange(content),
    [],
  );

  return (
    <CodeMirror
      className="text-sm w-full"
      theme="dark"
      height="100%"
      width="100%"
      value={editorText}
      onChange={onChange}
    ></CodeMirror>
  );
};

export default CodeEditor;
