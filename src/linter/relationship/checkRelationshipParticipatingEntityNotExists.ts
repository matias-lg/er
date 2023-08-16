import { ER } from "../../types/parser/ER";
import { RelationshipParticipatingEntityNotExists } from "../../types/linter/SemanticError";

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
