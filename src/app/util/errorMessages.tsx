import { SemanticError } from "../../ERDoc/types/linter/SemanticError";
import { useTranslations } from "next-intl";

type translation = ReturnType<typeof useTranslations<string>>;

// TODO: refactor, test
const getErrorMessage = (t: translation, err: SemanticError): string => {
  switch (err.type) {
    // Entity errors
    case "ENTITY_DUPLICATE":
      return t("ENTITY_DUPLICATE", { entityName: err.entityName });

    case "ENTITY_HAS_NO_KEY":
      return t("ENTITY_HAS_NO_KEY", { entityName: err.entityName });

    case "ENTITY_DUPLICATE_ATTRIBUTE":
      return t("ENTITY_DUPLICATE_ATTRIBUTE", {
        entityName: err.entityName,
        attributeName: err.attributeName,
      });

    case "ENTITY_EXTENDS_NON_EXISTENT_ENTITY":
      return t("ENTITY_EXTENDS_NON_EXISTENT_ENTITY", {
        entityName: err.entityName,
        extendsEntityName: err.extendsEntityName,
      });

    case "ENTITY_EXTENDS_CHILD_ENTITY":
      return t("ENTITY_EXTENDS_CHILD_ENTITY", {
        childEntityName: err.childEntityName,
        parentEntityName: err.parentEntityName,
      });

    case "WEAK_ENTITY_NOT_IN_RELATIONSHIP":
      return t("WEAK_ENTITY_NOT_IN_RELATIONSHIP", {
        entityName: err.entityName,
        relationshipName: err.relationshipName,
      });

    case "WEAK_ENTITY_NOT_TOTAL_PARTICIPATION":
      return t("WEAK_ENTITY_NOT_TOTAL_PARTICIPATION", {
        entityName: err.entityName,
        relationshipName: err.relationshipName,
      });

    case "WEAK_ENTITY_DEPENDS_ON_NON_EXISTENT_RELATIONSHIP":
      return t("WEAK_ENTITY_DEPENDS_ON_NON_EXISTENT_RELATIONSHIP", {
        entityName: err.entityName,
        relationshipName: err.relationshipName,
      });

    case "CHILD_ENTITY_HAS_KEY":
      return t("CHILD_ENTITY_HAS_KEY", { entityName: err.entityName });

    // Relationship errors
    case "RELATIONSHIP_DUPLICATE":
      return t("RELATIONSHIP_DUPLICATE", {
        relationshipName: err.relationshipName,
      });

    case "RELATIONSHIP_DUPLICATE_ATTRIBUTE":
      return t("RELATIONSHIP_DUPLICATE_ATTRIBUTE", {
        relationshipName: err.relationshipName,
        attributeName: err.attributeName,
      });

    case "RELATIONSHIP_DUPLICATE_PARTICIPANT":
      return t("RELATIONSHIP_DUPLICATE_PARTICIPANT", {
        relationshipName: err.relationshipName,
        entityName: err.entityName,
      });

    case "RELATIONSHIP_PARTICIPATING_ENTITY_NOT_EXISTS":
      return t("RELATIONSHIP_PARTICIPATING_ENTITY_NOT_EXISTS", {
        relationshipName: err.relationshipName,
        entityName: err.entityName,
      });

    case "RELATIONSHIP_LESS_THAN_TWO_PARTICIPATING_ENTITIES":
      return t("RELATIONSHIP_LESS_THAN_TWO_PARTICIPATING_ENTITIES", {
        relationshipName: err.relationshipName,
      });

    case "AGGREGATION_USES_ENTITY_NAME":
      return t("AGGREGATION_USES_ENTITY_NAME", {
        aggregationName: err.aggregationName,
      });

    case "AGGREGATION_DUPLICATE":
      return t("AGGREGATION_DUPLICATE", {
        aggregationName: err.aggregationName,
      });

    case "AGGREGATION_RELATIONSHIP_NOT_EXISTS":
      return t("AGGREGATION_RELATIONSHIP_NOT_EXISTS", {
        aggregationName: err.aggregationName,
        relationshipName: err.relationshipName,
      });

    case "AGGREGATION_RELATIONSHIP_ALREADY_USED":
      return t("AGGREGATION_RELATIONSHIP_ALREADY_USED", {
        aggregationName: err.aggregationName,
        relationshipName: err.relationshipName,
      });

    default: {
      const exhaustiveCheck: never = err;
      throw new Error(
        `Unhandled error type: ${JSON.stringify(exhaustiveCheck)}`,
      );
    }
  }
};

export default getErrorMessage;
