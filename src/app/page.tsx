"use client";
import { useEffect, useState } from "react";
import { getERDoc } from "../ERDoc";
import CodeEditor from "./CodeEditor";
import { SemanticError } from "../ERDoc/types/linter/SemanticError";
import { ER } from "../ERDoc/types/parser/ER";
import getErrorMessage from "./util/errorMessages";

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
        <div className="h-[40%] overflow-auto">
          <table className="h-full w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              {hasSyntaxError ? (
                <tr>
                  <th className="px-6 py-3 sticky top-0 bg-gray-700">
                    Syntax Error
                  </th>
                </tr>
              ) : (
                <tr>
                  <th className="px-6 py-3 sticky top-0 bg-gray-700">Error:</th>
                  <th className="px-6 py-3 sticky top-0 bg-gray-700">
                    Location:
                  </th>
                </tr>
              )}
            </thead>
            <tbody>
              {hasSyntaxError ? (
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td className="px-6 py-4"> {JSON.stringify(syntaxError)} </td>
                </tr>
              ) : (
                semanticErrors.map((err) => {
                  return (
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <td className="text-lg px-6 py-4">
                        {" "}
                        {getErrorMessage(err)}{" "}
                      </td>
                      <td className="px-6 py-4">
                        {JSON.stringify(err.location)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Page;
