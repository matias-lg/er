import { ER } from "../types/parser/ER";
import { SemanticError } from "../types/linter/SemanticError";
import { checkEntityDuplicate } from "./checkEntityDuplicate";
import { checkEntityDuplicateAttribute } from "./checkEntityDuplicateAttribute";
import { checkEntityNoPrimaryKey } from "./checkEntityNoPrimaryKey";
import { checkEntityExtendsNonExistentEntity } from "./checkExtendsExistingEntity";

type checkErrorFunction = (er: ER) => SemanticError[];

export const getSemanticErrors = (er: ER): SemanticError[] => {
  const validators: checkErrorFunction[] = [
    checkEntityDuplicate,
    checkEntityDuplicateAttribute,
    checkEntityNoPrimaryKey,
    checkEntityExtendsNonExistentEntity,
  ];

  let errors: SemanticError[] = [];
  for (const validator of validators) {
    errors = errors.concat(validator(er));
  }
  return errors;
};