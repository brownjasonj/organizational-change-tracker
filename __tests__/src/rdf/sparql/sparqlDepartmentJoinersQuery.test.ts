import 'reflect-metadata';
import { sparqlDepartmentJoinersQuery, sparqlJoinersQueryByDepartment } from '../../../../src/rdf/sparql/sparqlDepartmentJoinersQuery';

describe("sparqlDepartmentJoinersQuery test", () => {
    test("Returns valid query string", async () => {
        const startDate: Date = new Date();
        const endDate: Date = new Date();
        const query = sparqlDepartmentJoinersQuery(startDate, endDate);
        expect(query).toContain(startDate.toISOString());
        expect(query).toContain(endDate.toISOString());
    });

    test("Returns valid query string", async () => {
        const departmentCode: string = "ABC";
        const startDate: Date = new Date();
        const endDate: Date = new Date();
        const query = sparqlJoinersQueryByDepartment(departmentCode, startDate, endDate);
        expect(query).toContain(departmentCode);
        expect(query).toContain(startDate.toISOString());
        expect(query).toContain(endDate.toISOString());
    });
});