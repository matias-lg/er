import { ER } from "../../types/parser/ER";
import { RelationshipDuplicateError } from "../../types/linter/SemanticError";
import { TokenLocation } from "../../types/parser/TokenLocation";

/**
 * Finds duplicate relationships by name and participants in an ER object
 * @param {ER} er - The ER object to lint
 * @return {RelationshipDuplicateError[]} An array of errors for each duplicate relationship
 */
export const checkRelationshipDuplicate = (
  er: ER,
): RelationshipDuplicateError[] => {
  const errors: RelationshipDuplicateError[] = [];
  const relationshipNameFrequency = new Map<
    string,
    { cnt: number; lastLocation: TokenLocation }
  >();
  for (const rel of er.relationships) {
    const sortedRelationshipParticipantNames = rel.participantEntities
      .map((p) => p.entityName)
      .sort();
    const mapKey = [rel.name, ...sortedRelationshipParticipantNames].join(",");
    const relInMap = relationshipNameFrequency.get(mapKey);
    if (relInMap === undefined) {
      relationshipNameFrequency.set(mapKey, {
        cnt: 1,
        lastLocation: rel.location,
      });
    } else {
      relInMap.cnt++;
      relInMap.lastLocation = rel.location;
    }
  }

  for (const [rel, freqAndLocation] of relationshipNameFrequency) {
    if (freqAndLocation.cnt > 1) {
      errors.push({
        type: "RELATIONSHIP_DUPLICATE",
        relationshipName: rel.split(",")[0],
        location: freqAndLocation.lastLocation,
      });
    }
  }

  return errors;
};
