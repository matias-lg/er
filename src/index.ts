import { parse } from "./parser";
import { ER } from "./types/parser/ER";
import { SemanticError } from "./types/linter/SemanticError";
import { getSemanticErrors } from "./linter";

/**
 * Parses an ERDoc string into an ER object then lints it to get semantic errors
 * @param {string} erString - The ERDoc string to parse
 * @return {[ER, SemanticError[]]} A tuple containing the ER object from a successful parse and the semantic errors
 * @throws {SyntaxError} If the ERDoc string is not valid
 */
export const getERDoc = (erString: string): [ER, SemanticError[]] => {
  const er = parse(erString);
  const semanticErrors = getSemanticErrors(er);
  return [er, semanticErrors];
};
