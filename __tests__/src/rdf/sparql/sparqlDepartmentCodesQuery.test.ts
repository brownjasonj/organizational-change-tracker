import 'reflect-metadata';
import { sparqlDepartmentCodesQuery } from '../../../../src/rdf/sparql/sparqlDepartmentCodesQuery';

describe("SparqlDepartmentCodesQuery test", () => {
    test("Returns valid query string", async () => {
        const asOfDate: Date = new Date()
        const query = sparqlDepartmentCodesQuery(asOfDate);
        expect(query).toContain(asOfDate.toISOString());
    });
});