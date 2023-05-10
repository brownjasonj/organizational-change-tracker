import 'reflect-metadata';
import { sparqlCorporateTitleHistoryByEmployeeIdQuery } from "../../../../src/rdf/sparql/sparqlCorporateTitleHistoryByEmployeeIdQuery";

describe("SparqlCorporateTitleHistoryByEmployeeIdQuery test", () => {
    test("Returns valid query string", async () => {
        const query = sparqlCorporateTitleHistoryByEmployeeIdQuery("123456789");
        expect(query).toContain("123456789");
    });
});