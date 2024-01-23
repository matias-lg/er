import { SemanticError } from "../types/linter/SemanticError";
import { ER } from "../types/parser/ER";
import { checkEntityDuplicate } from "./entity/checkEntityDuplicate";
import { checkEntityDuplicateAttribute } from "./entity/checkEntityDuplicateAttribute";
import { checkEntityNoKey } from "./entity/checkEntityNoKey";
import { checkEntityExtendsNonExistentEntity } from "./entity/checkExtendsExistingEntity";
import { checkWeakEntityRelationshipExists } from "./entity/checkWeakEntityRelationshipExists";
import { checkWeakEntityInRelationship } from "./entity/checkWeakEntityInRelationship";
import { checkWeakEntityConstraints } from "./entity/checkWeakEntityHasTotalParticipation";
import { checkChildEntityHasKey } from "./entity/checkChildEntityHasKey";
import { checkRelationshipDuplicate } from "./relationship/checkRelationshipDuplicate";
import { checkRelationshipDuplicateAttribute } from "./relationship/checkRelationshipDuplicateAttribute";
import { checkRelationshipLessThanTwoParticipatingEntities } from "./relationship/checkRelationshipLessThanTwoParticipatingEntities";
import { checkRelationshipDuplicateParticipant } from "./relationship/checkRelationshipDuplicateParticipant";
import { checkAggregationDuplicate } from "./aggregation/checkAggregationDuplicate";
import { checkAggregationRelationshipNotExists } from "./aggregation/checkAggregationRelationshipNotExists";
import { checkAggregationUsesSameRelationship } from "./aggregation/checkAggregationUsesSameRelationship";
import { checkAggregationUsesEntityName } from "./aggregation/checkAggregationUsesEntityName";
import { checkRelationshipParticipatingEntityNotExists } from "./relationship/checkRelationshipParticipatingEntityNotExists";
import { checkEntityExtendsChildEntity } from "./entity/checkEntityExtendsChild";
import { checkWeakEntityNoPkey } from "./entity/checkWeakEntityNoPkey";

type checkErrorFunction = (er: ER) => SemanticError[];

const inheritanceValidators: checkErrorFunction[] = [
  checkEntityDuplicateAttribute,
  checkEntityNoKey,
];

const validators: checkErrorFunction[] = [
  checkEntityDuplicate,
  checkEntityExtendsNonExistentEntity,

  checkChildEntityHasKey,

  checkWeakEntityRelationshipExists,
  checkWeakEntityInRelationship,
  checkWeakEntityNoPkey,
  checkWeakEntityConstraints,

  checkRelationshipDuplicate,
  checkRelationshipDuplicateAttribute,
  checkRelationshipLessThanTwoParticipatingEntities,
  checkRelationshipDuplicateParticipant,
  checkRelationshipParticipatingEntityNotExists,

  checkAggregationDuplicate,
  checkAggregationRelationshipNotExists,
  checkAggregationUsesSameRelationship,
  checkAggregationUsesEntityName,
];

export const getSemanticErrors = (er: ER): SemanticError[] => {
  let errors: SemanticError[] = [];

  const cycleErrors = checkEntityExtendsChildEntity(er);
  if (cycleErrors.length > 0) {
    errors.push(...cycleErrors);
  } else {
    for (const validator of inheritanceValidators) {
      errors.push(...validator(er));
    }
  }

  for (const validator of validators) {
    errors.push(...validator(er));
  }
  return errors;
};
