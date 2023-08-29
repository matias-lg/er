"use client";
import { useEffect, useState } from "react";
import { getERDoc } from "../../ERDoc";
import CodeEditor from "./CodeEditor";
import { SemanticError } from "../../ERDoc/types/linter/SemanticError";
import { ER } from "../../ERDoc/types/parser/ER";
import ErrorTable from "./ErrorTable";

const Page = () => {
  const [_, setERDoc] = useState<ER | null>(null);
  const [inputText, setInputText] = useState<string>("");

  const [semanticErrors, setSemanticErrors] = useState<SemanticError[]>([]);

  const [hasSyntaxError, setHasSyntaxError] = useState<boolean>(false);
  const [syntaxError, setSyntaxError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      setHasSyntaxError(false);
      const t0 = performance.now();
      const [erDoc, errors] = getERDoc(inputText);
      setERDoc(erDoc);
      console.log("Parse + lint took " + (performance.now() - t0) + "ms");
      setSemanticErrors(errors);
    } catch (e) {
      setHasSyntaxError(true);
      if (e instanceof Error) setSyntaxError(e);
    }
  }, [inputText]);
  return (
    <div className="flex h-full">
      <div className="w-[600px] xl:w-1/3">
        <div className="flex h-[60%] w-full">
          <CodeEditor
            editorText={inputText}
            onEditorTextChange={setInputText}
          />
        </div>
        <ErrorTable
          hasSyntaxError={hasSyntaxError}
          semanticErrors={semanticErrors}
          syntaxError={syntaxError}
        />
      </div>
    </div>
  );
};

export default Page;
