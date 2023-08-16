import { SemanticError } from "../types/linter/SemanticError";
import { ER } from "../types/parser/ER";
import { checkEntityDuplicate } from "./entity/checkEntityDuplicate";
import { checkEntityDuplicateAttribute } from "./entity/checkEntityDuplicateAttribute";
import { checkEntityNoPrimaryKey } from "./entity/checkEntityNoPrimaryKey";
import { checkEntityExtendsNonExistentEntity } from "./entity/checkExtendsExistingEntity";
import { checkWeakEntityRelationshipExists } from "./entity/checkWeakEntityRelationshipExists";
import { checkWeakEntityInRelationship } from "./entity/checkWeakEntityInRelationship";
import { checkWeakEntityHasTotalParticipation } from "./entity/checkWeakEntityHasTotalParticipation";
import { checkChildEntityHasKey } from "./entity/checkChildEntityHasKey";
import { checkRelationshipDuplicate } from "./relationship/checkRelationshipDuplicate";

type checkErrorFunction = (er: ER) => SemanticError[];

export const getSemanticErrors = (er: ER): SemanticError[] => {
  const validators: checkErrorFunction[] = [
    checkEntityDuplicate,
    checkEntityDuplicateAttribute,
    checkEntityNoPrimaryKey,
    checkEntityExtendsNonExistentEntity,

    checkChildEntityHasKey,

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
