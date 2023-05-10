import 'reflect-metadata';
import { sparqlDepartmentLeaversQuery, sparqlLeaversQueryByDepartment } from '../../../../src/rdf/sparql/sparqlDepartmentLeaversQuery';
import { sparqlJoinersQueryByDepartment } from '../../../../src/rdf/sparql/sparqlDepartmentJoinersQuery';

describe("sparqlDepartmentLeaversQuery test", () => {
    test("Returns valid query string", async () => {
        const startDate: Date = new Date();
        const endDate: Date = new Date();
        const query = sparqlDepartmentLeaversQuery(startDate, endDate);
        expect(query).toContain(startDate.toISOString());
        expect(query).toContain(endDate.toISOString());
    });


    test("Returns valid query string", async () => {
        const departmentCode: string = "ABC";
        const startDate: Date = new Date();
        const endDate: Date = new Date();
        const query = sparqlLeaversQueryByDepartment(departmentCode, startDate, endDate);
        expect(query).toContain(departmentCode);
        expect(query).toContain(startDate.toISOString());
        expect(query).toContain(endDate.toISOString());
    });
});
