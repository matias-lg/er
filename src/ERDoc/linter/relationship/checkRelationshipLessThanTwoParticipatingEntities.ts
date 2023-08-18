import { ER } from "../../types/parser/ER";
import { RelationshipLessThanTwoParticipatingEntitiesError } from "../../types/linter/SemanticError";

/**
 * Finds relationships with less than 2 participants in an ER object
 * @param {ER} er - The ER object to lint
 * @return {RelationshipLessThanTwoParticipatingEntitiesError[]} An array of errors for each relationship with less than 2 participants
 */
export const checkRelationshipLessThanTwoParticipatingEntities = (
  er: ER,
): RelationshipLessThanTwoParticipatingEntitiesError[] => {
  const errors: RelationshipLessThanTwoParticipatingEntitiesError[] = [];

  for (const relationship of er.relationships) {
    if (relationship.participantEntities.length > 1) continue;
    const singleParticipant = relationship.participantEntities[0];
    if (singleParticipant.isComposite) {
      if (singleParticipant.childParticipants.length > 1) continue;
    }
    errors.push({
      type: "RELATIONSHIP_LESS_THAN_TWO_PARTICIPATING_ENTITIES",
      relationshipName: relationship.name,
      location: relationship.location,
    });
  }

  return errors;
};
