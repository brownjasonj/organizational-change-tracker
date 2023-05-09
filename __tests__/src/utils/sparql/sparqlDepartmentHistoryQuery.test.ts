import 'reflect-metadata';
import { sparqlDepartmentHistoryQuery } from '../../../../src/rdf/sparql/sparqlDepartmentHistoryQuery';

describe("sparqlDepartmentHistoryQuery test", () => {
    test("Returns valid query string", async () => {
        const departmentName = "ABC";
        const startDate: Date = new Date();
        const endDate: Date = new Date();
        const query = sparqlDepartmentHistoryQuery(departmentName, startDate, endDate);
        expect(query).toContain(departmentName);
        expect(query).toContain(startDate.toISOString());
        expect(query).toContain(endDate.toISOString());
    });
});