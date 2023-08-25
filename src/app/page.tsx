"use client";
import { useEffect, useState } from "react";
import { getERDoc } from "../ERDoc";
import CodeEditor from "./CodeEditor";
import { SemanticError } from "../ERDoc/types/linter/SemanticError";
import { ER } from "../ERDoc/types/parser/ER";

const Page = () => {
  const [ERDoc, setERDoc] = useState<ER | null>(null);
  const [inputText, setInputText] = useState<string>("");

  const [semanticErrors, setSemanticErrors] = useState<SemanticError[]>([]);

  const [hasSyntaxError, setHasSyntaxError] = useState<boolean>(false);
  const [syntaxError, setSyntaxError] = useState<any | null>(null);

  useEffect(() => {
    try {
      setHasSyntaxError(false);
      const [erDoc, errors] = getERDoc(inputText);
      setERDoc(erDoc);
      setSemanticErrors(errors);
    } catch (e) {
      setHasSyntaxError(true);
      setSyntaxError(e);
    }
  }, [inputText]);
  return (
    <>
      <CodeEditor editorText={inputText} onEditorTextChange={setInputText} />
      <p className="pt-11 text-sky-600 text-1xl"> Errores: </p>
      <div className="text-1l">
        {hasSyntaxError
          ? JSON.stringify(syntaxError)
          : semanticErrors.map((err) => {
              return (
                <>
                  <br /> <p> {JSON.stringify(err) + "\n\n"} </p>
                </>
              );
            })}
      </div>
    </>
  );
};

export default Page;
