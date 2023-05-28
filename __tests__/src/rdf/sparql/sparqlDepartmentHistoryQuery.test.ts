import { plainToClass } from 'class-transformer';
import 'reflect-metadata';
import { sparqlDepartmentHistoryQuery } from '../../../../src/rdf/sparql/sparqlDepartmentHistoryQuery';
import { defaultedPrefixes, RdfOntologyConfiguration } from '../../../models/eom/configuration/RdfOntologyConfiguration';

describe("sparqlDepartmentHistoryQuery test", () => {
    let rdfOntologyDefinitions = plainToClass(RdfOntologyConfiguration, { prefixes: defaultedPrefixes});

    test("Returns valid query string", async () => {
        const departmentName = "ABC";
        const startDate: Date = new Date();
        const endDate: Date = new Date();
        const query = sparqlDepartmentHistoryQuery(rdfOntologyDefinitions, departmentName, startDate, endDate);
        expect(query).toContain(departmentName);
        expect(query).toContain(startDate.toISOString());
        expect(query).toContain(endDate.toISOString());
    });
});