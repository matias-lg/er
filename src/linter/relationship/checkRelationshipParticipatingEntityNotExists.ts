import { ER } from "../../types/parser/ER";
import { RelationshipParticipatingEntityNotExists } from "../../types/linter/SemanticError";

/**
 * Finds relationships with a participant that doesn't exist in an ER object
 * @param {ER} er - The ER object to lint
 * @return {RelationshipParticipatingEntityNotExists[]} An array of errors for each relationship with a participant that doesn't exist
 */
export const checkRelationshipParticipatingEntityNotExists = (
  er: ER,
): RelationshipParticipatingEntityNotExists[] => {
  const errors: RelationshipParticipatingEntityNotExists[] = [];
  const existingEntities = new Map<string, boolean>();
  er.entities.forEach((ent) => existingEntities.set(ent.name, true));
  for (const rel of er.relationships) {
    for (const participatingEntity of rel.participantEntities) {
      const exists = existingEntities.get(participatingEntity.entityName);
      if (!exists) {
        errors.push({
          type: "RELATIONSHIP_PARTICIPATING_ENTITY_NOT_EXISTS",
          relationshipName: rel.name,
          entityName: participatingEntity.entityName,
          location: participatingEntity.location,
        });
      }
    }
  }

  return errors;
};
