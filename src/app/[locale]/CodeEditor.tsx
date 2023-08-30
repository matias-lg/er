"use client";
import CodeMirror from "@uiw/react-codemirror";
import { useCallback, Dispatch } from "react";
import { colors } from "../util/colors";
import { createTheme } from '@uiw/codemirror-themes';

type Props = {
  editorText: string;
  onEditorTextChange: Dispatch<string>;
};

const myTheme = createTheme({
  theme: 'dark',
  settings: {
    background: colors.textEditorBackground,
    foreground: '#939EB2',
    gutterBackground: colors.textEditorBackground,
    gutterForeground: '#939EB2',
    lineHighlight: colors.textEditorBackground,
  },
  styles: []
})


const CodeEditor = ({ editorText, onEditorTextChange }: Props) => {
  const onChange = useCallback(
    (content: string, _: never) => onEditorTextChange(content),
    [],
  );

  return (
    <CodeMirror
      className="text-sm w-full min-h-full"
      theme={myTheme}
      height="100%"
      width="100%"
      value={editorText}
      onChange={onChange}
    ></CodeMirror>
  );
};

export default CodeEditor;
