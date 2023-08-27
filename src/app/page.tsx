"use client";
import { useEffect, useState } from "react";
import { getERDoc } from "../ERDoc";
import CodeEditor from "./CodeEditor";
import { SemanticError } from "../ERDoc/types/linter/SemanticError";
import { ER } from "../ERDoc/types/parser/ER";
import getErrorMessage from "./util/errorMessages";

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
      <br/>
      <div className="relative overflow-x-auto w-1/2">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            {hasSyntaxError ? (
              <tr>
                <th className="px-6 py-3"> Syntax Error </th>
              </tr>
            ) : (
              <tr>
                <th className="px-6 py-3"> Error: </th>
                <th className="px-6 py-3"> Location: </th>
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
                    <td className="px-6 py-4"> {getErrorMessage(err)} </td>
                    <td className="px-6 py-4">
                      {" "}
                      {JSON.stringify(err.location)}{" "}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Page;
