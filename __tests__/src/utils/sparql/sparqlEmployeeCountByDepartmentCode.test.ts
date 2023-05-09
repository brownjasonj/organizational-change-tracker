import 'reflect-metadata';
import { sparqlCorporateTitleHistoryByEmployeeIdQuery } from "../../../../src/rdf/sparql/sparqlCorporateTitleHistoryByEmployeeIdQuery";
import { sparqlEmployeeCountByDepartmentCodeQuery } from '../../../../src/rdf/sparql/sparqlEmployeeCountByDepartmentCode';

describe("sparqlEmployeeCountByDepartmentCode test", () => {
    test("Returns valid query string", async () => {
        const asOfDate: Date = new Date();
        const departmentCode = "ABC";
        const query = sparqlEmployeeCountByDepartmentCodeQuery(departmentCode, asOfDate);
        expect(query).toContain(departmentCode);
        expect(query).toContain(asOfDate.toISOString());
    });
});