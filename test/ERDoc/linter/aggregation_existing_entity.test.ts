import { ER } from "../../../src/ERDoc/types/parser/ER";
import { checkAggregationUsesEntityName } from "../../../src/ERDoc/linter/aggregation/checkAggregationUsesEntityName";
import { parse } from "../../../src/ERDoc/parser";

describe("Linter detects aggregations with same name as existing entity", () => {
  it("Detects aggregation with same name as existing entity", () => {
    const errors = checkAggregationUsesEntityName(EntityNameClashER);
    expect(errors.length).toBe(1);
    expect(errors[0].type).toBe("AGGREGATION_USES_ENTITY_NAME");
    expect(errors[0].aggregationName).toBe("profesor_dicta_curso");
  });
});

const EntityNameClashER: ER = parse(
  `entity profesor_dicta_curso {
  id key
  materia
}

aggregation profesor_dicta_curso(Dicta)`,
);
