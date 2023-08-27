import { SemanticError } from "../../ERDoc/types/linter/SemanticError";

// TODO: refactor, test, i18n
const getErrorMessage = (err: SemanticError): string => {
  switch (err.type) {
    // Entity errors
    case "ENTITY_DUPLICATE":
      return `Entity "${err.entityName}" is duplicate`;

    case "ENTITY_HAS_NO_KEY":
      return `Entity "${err.entityName}" has no key`;

    case "ENTITY_DUPLICATE_ATTRIBUTE":
      return `Entity "${err.entityName}" has duplicated attribute "${err.attributeName}"`;

    case "ENTITY_EXTENDS_NON_EXISTENT_ENTITY":
      return `Entity "${err.entityName}" extends non-existent entity "${err.extendsEntityName}"`;

    case "WEAK_ENTITY_NOT_IN_RELATIONSHIP":
      return `Weak entity "${err.entityName}" depends on non-existent relationship "${err.relationshipName}"`;

    case "WEAK_ENTITY_NOT_TOTAL_PARTICIPATION":
      return `Weak entity "${err.entityName}" doesn't have total participation in relationship "${err.relationshipName}"`;

    case "WEAK_ENTITY_DEPENDS_ON_NON_EXISTENT_RELATIONSHIP":
      return `Weak entity "${err.entityName}" depends on non-existent relationship "${err.relationshipName}"`;

    case "CHILD_ENTITY_HAS_KEY":
      return `Child entity "${err.entityName}" has identifying key`;

    // Relationship errors
    case "RELATIONSHIP_DUPLICATE":
      return `Relationship "${err.relationshipName}" is duplicate`;

    case "RELATIONSHIP_DUPLICATE_ATTRIBUTE":
      return `Relationship "${err.relationshipName}" has duplicate attribute "${err.attributeName}"`;

    case "RELATIONSHIP_DUPLICATE_PARTICIPANT":
      return `Relationship "${err.relationshipName}" has duplicate participant "${err.entityName}"`;

    case "RELATIONSHIP_PARTICIPATING_ENTITY_NOT_EXISTS":
      return `Relationship "${err.relationshipName}" has non-existent participating entity "${err.entityName}"`;

    case "RELATIONSHIP_LESS_THAN_TWO_PARTICIPATING_ENTITIES":
      return `Relationship "${err.relationshipName}" has less than two participating entities`;

    case "AGGREGATION_USES_ENTITY_NAME":
      return `Entity with name "${err.aggregationName}" already exists`;

    case "AGGREGATION_DUPLICATE":
      return `Aggregation "${err.aggregationName}" is duplicate`;

    case "AGGREGATION_RELATIONSHIP_NOT_EXISTS":
      return `Aggregation "${err.aggregationName}" encapsulates non-existent relationship "${err.relationshipName}"`;

    case "AGGREGATION_RELATIONSHIP_ALREADY_USED":
      return `Aggregation "${err.aggregationName}" encapsulates relationship "${err.relationshipName}" which is already used`;

    default:
      const exhaustiveCheck: never = err;
      throw new Error(`UNEXPECTED ERROR: "${exhaustiveCheck}"`);
  }
};

export default getErrorMessage;
