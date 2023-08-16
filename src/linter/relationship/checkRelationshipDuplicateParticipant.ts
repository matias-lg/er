import { ER } from "../../types/parser/ER";
import { RelationshipDuplicateParticipantError } from "../../types/linter/SemanticError";

export const checkRelationshipDuplicateParticipant = (
  er: ER,
): RelationshipDuplicateParticipantError[] => {
  const errors: RelationshipDuplicateParticipantError[] = [];

  for (const rel of er.relationships) {
    const participantNames = new Map<string, number>();
    for (const participant of rel.participantEntities) {
      const participantName = participant.entityName;
      if (participantNames.has(participantName))
        participantNames.set(
          participantName,
          participantNames.get(participantName)! + 1,
        );
      else participantNames.set(participantName, 1);
    }
    for (const [participantName, freq] of participantNames) {
      if (freq > 1) {
        const lastLocation = rel.participantEntities
          .filter((participant) => participant.entityName === participantName)
          .pop()!.location;

        errors.push({
          type: "RELATIONSHIP_DUPLICATE_PARTICIPANT",
          entityName: participantName,
          relationshipName: rel.name,
          location: lastLocation,
        });
      }
    }
  }
  return errors;
};
