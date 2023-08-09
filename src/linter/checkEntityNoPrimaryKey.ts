import { ER } from "../types/parser/ER";
import { SemanticErrorType } from "../types/linter/SemanticError";
import { EntityNoPrimaryKeyError } from "../types/linter/SemanticError";

export const checkEntityNoPrimaryKey = (er: ER): EntityNoPrimaryKeyError[] => {
  const errors: EntityNoPrimaryKeyError[] = [];
  for (const entity of er.entities) {
    if (entity.attributes.some((attr) => attr.isKey)) continue;
    errors.push({
      type: SemanticErrorType.ENTITY_NO_PRIMARY_KEY,
      entityName: entity.name,
      location: entity.location,
    });
  }

  return errors;
};
