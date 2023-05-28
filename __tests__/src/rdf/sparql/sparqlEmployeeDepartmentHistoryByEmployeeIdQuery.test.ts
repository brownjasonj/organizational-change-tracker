import { plainToClass } from 'class-transformer';
import 'reflect-metadata';
import { sparqlEmployeeDepartmentHistoryQueryByEmployeeId } from '../../../../src/rdf/sparql/sparqlEmployeeDepartmentHistoryByEmployeeIdQuery';
import { defaultedPrefixes, RdfOntologyConfiguration } from '../../../models/eom/configuration/RdfOntologyConfiguration';

describe("sparqlEmployeeDepartmentHistoryByEmployeeIdQuery test", () => {
    let rdfOntologyDefinitions = plainToClass(RdfOntologyConfiguration, { prefixes: defaultedPrefixes});

    test("Returns valid query string", async () => {
        const employeeId = "123456789";
        const query = sparqlEmployeeDepartmentHistoryQueryByEmployeeId(rdfOntologyDefinitions, employeeId);
        expect(query).toContain(employeeId);
    });
});