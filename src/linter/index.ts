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
import { checkRelationshipDuplicateAttribute } from "./relationship/checkRelationshipDuplicateAttribute";
import { checkRelationshipLessThanTwoParticipatingEntities } from "./relationship/checkRelationshipLessThanTwoParticipatingEntities";
import { checkRelationshipDuplicateParticipant } from "./relationship/checkRelationshipDuplicateParticipant";
import { checkAggregationDuplicate } from "./aggregation/checkAggregationDuplicate";
import { checkAggregationRelationshipNotExists } from "./aggregation/checkAggregationRelationshipNotExists";

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
    checkRelationshipDuplicateAttribute,
    checkRelationshipLessThanTwoParticipatingEntities,
    checkRelationshipDuplicateParticipant,

    checkAggregationDuplicate,
    checkAggregationRelationshipNotExists,
  ];

  let errors: SemanticError[] = [];
  for (const validator of validators) {
    errors = errors.concat(validator(er));
  }
  return errors;
};
