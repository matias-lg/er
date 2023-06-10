import { ER } from "../../src/types/ER";
import { parse } from "../../src/er-parser";

const simpleRelation = `
Relation Investiga(Policia, Denuncia){
   fecha_resolucion 
}`



describe("Parses Relations", () => {
    it("parses a simple relation", () => {
        const er: ER = parse(simpleRelation);
        expect(er).toStrictEqual({
            entities: [],
            relationships: [
                {
                    type: "relationship",
                    name: "Investiga",
                    participantEntities: [
                        {
                            entityName: "Policia",
                            cardinality: "N",
                            participation: "partial"
                        },
                        {
                            entityName: "Denuncia",
                            cardinality: "N",
                            participation: "partial"
                        }
                    ],
                    attributes: [
                        {
                            name: "fecha_resolucion",
                            isMultiValued: false,
                            childAttributesNames: null,
                        }],
                }
            ]} as ER);
    });
});
