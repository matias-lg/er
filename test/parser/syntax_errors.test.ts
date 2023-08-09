import { parse } from "../../src/parser";

/***
 * Checks that the error location is correct for an invalid ERDoc string
 * @param {string} invalidERString - The invalid ERDoc string to parse
 * @param {number} expectedLine - The expected line of the error
 * @param {number} expectedColumn - The expected column of the error
 * @return {boolean} True if the error location is correct, false otherwise
 */
const checkErrorLocation = (
  invalidERString: string,
  expectedLine: number,
  expectedColumn: number
): boolean => {
  try {
    parse(invalidERString);
    return false;
  } catch (error) {
    return (
      error.location.start.line === expectedLine &&
      error.location.start.column === expectedColumn
    );
  }
};

const invalidEntity = `entity Student {
        RUT key
        full_name: [first_name, last_name]
        age
    }

    entityUniversity {
        name
        address
        foundation_date
        university_id key
    }`;

const singleLineER = `AGGREGATION Estudiante_Estudia_en_Universidad(Estudia_en`;

describe("Parser reports the correct location of the error when parsing invalid ER Models", () => {
  it("throws an error with the error location when parsing an invalid Entity", () => {
    expect(checkErrorLocation(invalidEntity, 7, 11)).toBe(true);
  });

  it("throws an error with the error location when parsing an invalid ER Model in a single line", () => {
    expect(checkErrorLocation(singleLineER, 1, 57)).toBe(true);
  });
});