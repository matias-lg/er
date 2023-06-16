import { ER } from "../../src/types/ER";
import { Aggregation } from "../../src/types/Aggregation";
import { parse } from "../../src/parser";

const regularAggregation = `aggregation Cliente_compra_producto(Compra)`;
const explicitCurlyAggregation = `aggregation Cliente_compra_producto(Compra) {}`;

const badAggregations = [
    `aggregation Cliente_compra_producto(Compra`,
    `aggregation (Compra)`,
    `aggregation Cliente_compra_producto()`,
    `aggregation Cliente_compra_producto`,
    `aggregation Cliente_compra_producto{}`,
] 


describe("Parses Aggregations", () => {
    it("parses a regular aggregation", () => {
        const er: ER = parse(regularAggregation);
        expect(er.aggregations).toStrictEqual<Aggregation[]>(
             [
                {
                    type: "aggregation",
                    name: "Cliente_compra_producto",
                    aggregatedRelationshipName: "Compra",
                },
            ]);
    });

    it("parses an aggregation with explicit curly braces", () => {
        const er: ER = parse(explicitCurlyAggregation);
        expect(er.aggregations).toStrictEqual<Aggregation[]>(
            [
                {
                    type: "aggregation",
                    name: "Cliente_compra_producto",
                    aggregatedRelationshipName: "Compra",
                },
            ]
        );
    });

    it("throws an error when parsing bad aggregations", () => {
        badAggregations.forEach((badAggregation) => {
            expect(() => parse(badAggregation)).toThrow();
        });
    });
});