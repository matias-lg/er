"use client";
import CodeMirror from "@uiw/react-codemirror";
import { useCallback, Dispatch, useEffect, useState } from "react";
import { colors } from "../../util/colors";
import { createTheme } from "@uiw/codemirror-themes";
import { editor } from "monaco-editor";
import { Editor } from "@monaco-editor/react";

type Props = {
  editorText: string;
  onEditorTextChange: Dispatch<string>;
};

const myTheme = createTheme({
  theme: "dark",
  settings: {
    background: colors.textEditorBackground,
    foreground: "#939EB2",
    gutterBackground: colors.textEditorBackground,
    gutterForeground: "#939EB2",
    lineHighlight: colors.textEditorBackground,
  },
  styles: [],
});

const CodeEditor = ({ editorText, onEditorTextChange }: Props) => {
  const onChange = useCallback(
    (content: string | undefined, _: any) =>
      onEditorTextChange(content as string),
    [],
  );

  return (
    <div className="p-4 h-full w-full">
    <Editor
      height={"100%"}
      value={editorText}
      onChange={onChange}
      options={{
        scrollBeyondLastLine: true,
        padding: {
          bottom: 0,
        },
        minimap: {
          enabled: false,
        },
      }}
    />
    </div>
  );
};

export default CodeEditor;
