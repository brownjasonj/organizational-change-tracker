import 'reflect-metadata';
import { sparqlEmployeeDepartmentHistoryQueryByEmployeeId } from '../../../../src/rdf/sparql/sparqlEmployeeDepartmentHistoryByEmployeeIdQuery';

describe("sparqlEmployeeDepartmentHistoryByEmployeeIdQuery test", () => {
    test("Returns valid query string", async () => {
        const employeeId = "123456789";
        const query = sparqlEmployeeDepartmentHistoryQueryByEmployeeId(employeeId);
        expect(query).toContain(employeeId);
    });
});