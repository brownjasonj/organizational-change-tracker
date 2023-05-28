import { plainToClass } from 'class-transformer';
import 'reflect-metadata';
import { sparqlDepartmentJoinersQuery, sparqlJoinersQueryByDepartment } from '../../../../src/rdf/sparql/sparqlDepartmentJoinersQuery';
import { defaultedPrefixes, RdfOntologyConfiguration } from '../../../models/eom/configuration/RdfOntologyConfiguration';

describe("sparqlDepartmentJoinersQuery test", () => {
    let rdfOntologyDefinitions = plainToClass(RdfOntologyConfiguration, { prefixes: defaultedPrefixes});

    test("Returns valid query string", async () => {
        const startDate: Date = new Date();
        const endDate: Date = new Date();
        const query = sparqlDepartmentJoinersQuery(rdfOntologyDefinitions, startDate, endDate);
        expect(query).toContain(startDate.toISOString());
        expect(query).toContain(endDate.toISOString());
    });

    test("Returns valid query string", async () => {
        const departmentCode: string = "ABC";
        const startDate: Date = new Date();
        const endDate: Date = new Date();
        const query = sparqlJoinersQueryByDepartment(rdfOntologyDefinitions, departmentCode, startDate, endDate);
        expect(query).toContain(departmentCode);
        expect(query).toContain(startDate.toISOString());
        expect(query).toContain(endDate.toISOString());
    });
});