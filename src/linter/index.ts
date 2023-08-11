import { SemanticError } from "../types/linter/SemanticError";
import { ER } from "../types/parser/ER";
import { checkEntityDuplicate } from "./checkEntityDuplicate";
import { checkEntityDuplicateAttribute } from "./checkEntityDuplicateAttribute";
import { checkEntityNoPrimaryKey } from "./checkEntityNoPrimaryKey";
import { checkEntityExtendsNonExistentEntity } from "./checkExtendsExistingEntity";
import { checkWeakEntityRelationshipExists } from "./checkWeakEntityRelationshipExists";
import { checkWeakEntityInRelationship } from "./checkWeakEntityInRelationship";
import { checkWeakEntityHasTotalParticipation } from "./checkWeakEntityHasTotalParticipation";
import { checkRelationshipDuplicate } from "./checkRelationshipDuplicate";

type checkErrorFunction = (er: ER) => SemanticError[];

export const getSemanticErrors = (er: ER): SemanticError[] => {
  const validators: checkErrorFunction[] = [
    checkEntityDuplicate,
    checkEntityDuplicateAttribute,
    checkEntityNoPrimaryKey,
    checkEntityExtendsNonExistentEntity,

    checkWeakEntityRelationshipExists,
    checkWeakEntityInRelationship,
    checkWeakEntityHasTotalParticipation,

    checkRelationshipDuplicate,
  ];

  let errors: SemanticError[] = [];
  for (const validator of validators) {
    errors = errors.concat(validator(er));
  }
  return errors;
};
