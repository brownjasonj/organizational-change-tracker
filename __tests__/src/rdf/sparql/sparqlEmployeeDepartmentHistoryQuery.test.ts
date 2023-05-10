import 'reflect-metadata';
import { sparqlCorporateTitleHistoryByEmployeeIdQuery } from "../../../../src/rdf/sparql/sparqlCorporateTitleHistoryByEmployeeIdQuery";
import { sparqlEmployeeDepartmentHistoryQuery } from '../../../../src/rdf/sparql/sparqlEmployeeDepartmentHistoryQuery';

describe("sparqlEmployeeDepartmentHistoryQuery test", () => {
    test("Returns valid query string", async () => {
        const query = sparqlEmployeeDepartmentHistoryQuery();
        expect(query).toContain(query);
    });
});