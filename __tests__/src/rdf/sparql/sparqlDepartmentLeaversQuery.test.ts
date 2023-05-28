import { plainToClass } from 'class-transformer';
import 'reflect-metadata';
import { sparqlDepartmentLeaversQuery, sparqlLeaversQueryByDepartment } from '../../../../src/rdf/sparql/sparqlDepartmentLeaversQuery';
import { defaultedPrefixes, RdfOntologyConfiguration } from '../../../models/eom/configuration/RdfOntologyConfiguration';

describe("sparqlDepartmentLeaversQuery test", () => {
    let rdfOntologyDefinitions = plainToClass(RdfOntologyConfiguration, { prefixes: defaultedPrefixes});

    test("Returns valid query string", async () => {
        const startDate: Date = new Date();
        const endDate: Date = new Date();
        const query = sparqlDepartmentLeaversQuery(rdfOntologyDefinitions, startDate, endDate);
        expect(query).toContain(startDate.toISOString());
        expect(query).toContain(endDate.toISOString());
    });

    test("Returns valid query string", async () => {
        const departmentCode: string = "ABC";
        const startDate: Date = new Date();
        const endDate: Date = new Date();
        const query = sparqlLeaversQueryByDepartment(rdfOntologyDefinitions, departmentCode, startDate, endDate);
        expect(query).toContain(departmentCode);
        expect(query).toContain(startDate.toISOString());
        expect(query).toContain(endDate.toISOString());
    });
});
