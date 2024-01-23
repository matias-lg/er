import { ER } from "../../types/parser/ER";
import { WeakEntityHasNoPkeyError } from "../../types/linter/SemanticError";

/**
 * Finds weak entities that don't have a pkey when some strong entity have other than cardinality of "1" in some identifying relationship.
 * @param {ER} er - The ER object to lint
 * @return {WeakEntityHasNoPkeyError[]} An array of errors for each weak entity without pkey
 */
export const checkWeakEntityNoPkey = (er: ER): WeakEntityHasNoPkeyError[] => {
  const errors: WeakEntityHasNoPkeyError[] = [];

  for (const entity of er.entities) {
    if (!entity.hasDependencies) continue;
    if (entity.attributes.some((attr) => attr.isKey)) continue;

    for (const dep of entity.dependsOn!.relationshipName) {
      const relationship = er.relationships.find((r) => r.name === dep);
      if (relationship === undefined) continue;

      const weakEntityInRelationship = relationship.participantEntities.find(
        (p) => p.entityName === entity.name,
      );
      if (weakEntityInRelationship === undefined) continue;

      let someIsMany = false;

      for (const participant of relationship.participantEntities) {
        if (participant.entityName === entity.name) continue;

        if (participant.isComposite) {
          if (
            participant.childParticipants.some(
              (child) => child.cardinality !== "1",
            )
          ) {
            someIsMany = true;
            break;
          }
        } else if (participant.cardinality !== "1") {
          someIsMany = true;
          break;
        }
      }

      if (someIsMany) {
        errors.push({
          type: "WEAK_ENTITY_HAS_NO_PKEY",
          entityName: entity.name,
          location: entity.location,
        });
        // we want to report only one error per weak entity
        break;
      }
    }
  }
  return errors;
};
