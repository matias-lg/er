import getErrorMessage from "../util/errorMessages";
import { SemanticError } from "../../ERDoc/types/linter/SemanticError";
import { useTranslations } from "next-intl";

type ErrorTableProps = {
  hasSyntaxError: boolean;
  syntaxError: Error | null;
  semanticErrors: SemanticError[];
};

const ErrorTable = ({
  hasSyntaxError,
  syntaxError,
  semanticErrors,
}: ErrorTableProps) => {
  const t = useTranslations("home.errorsTable");
  const semanticT = useTranslations("home.errorsTable.semanticErrorMessages");
  return (
    <div className="h-[40%] overflow-auto">
      <table className="h-full w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          {hasSyntaxError ? (
            <tr>
              <th className="px-6 py-3 sticky top-0 bg-gray-700">
                {t("syntaxError")}
              </th>
            </tr>
          ) : (
            <tr>
              <th className="px-6 py-3 sticky top-0 bg-gray-700">Error:</th>
              <th className="px-6 py-3 sticky top-0 bg-gray-700">Location:</th>
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
                    {getErrorMessage(semanticT, err)}
                  </td>
                  <td className="px-6 py-4">{JSON.stringify(err.location)}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ErrorTable;
