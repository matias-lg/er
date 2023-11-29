import { ER } from "../../../src/ERDoc/types/parser/ER";
import { checkAggregationDuplicate } from "../../../src/ERDoc/linter/aggregation/checkAggregationDuplicate";
import { parse } from "../../../src/ERDoc/parser";

describe("Linter detects duplicate aggregations", () => {
  it("Detects a duplicate aggregation", () => {
    const errors = checkAggregationDuplicate(duplicateAggregation);
    expect(errors.length).toBe(1);
    expect(errors[0].type).toBe("AGGREGATION_DUPLICATE");
    expect(errors[0].aggregationName).toBe("profesor_dicta_curso");
    expect(errors[0].location).toEqual({
      start: {
        offset: 40,
        line: 2,
        column: 1,
      },
      end: {
        offset: 79,
        line: 2,
        column: 40,
      },
    });
  });

  it("Detects no errors with different aggregations", () => {
    const errors = checkAggregationDuplicate(noDuplicateER);
    expect(errors.length).toBe(0);
  });

  it("Detects no errors with a single aggregation", () => {
    const errors = checkAggregationDuplicate(singleAggregationER);
    expect(errors.length).toBe(0);
  });

  it("Detects multiple duplicate aggregations", () => {
    const errors = checkAggregationDuplicate(multiWrongER);
    expect(errors.length).toBe(2);
  });
});

const duplicateAggregation: ER = parse(
  `aggregation profesor_dicta_curso(Dicta)
aggregation profesor_dicta_curso(Dicta)`,
);

const noDuplicateER: ER = parse(
  `aggregation profesor_teaches_course(Teaches)
aggregation DudeSellsCar(Sells)`,
);

const singleAggregationER: ER = parse(
  `aggregation profesor_dicta_curso(Dicta)`,
);

const multiWrongER: ER = parse(
  `aggregation profesor_teaches_course(Teaches)
aggregation DudeSellsCar(Sells)
aggregation profesor_teaches_course(Teaches)
aggregation DudeSellsCar(Sells)`,
);
