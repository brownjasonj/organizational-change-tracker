import { plainToClass } from 'class-transformer';
import 'reflect-metadata';
import { sparqlEmployeeCountByDepartmentCodeQuery } from '../../../../src/rdf/sparql/sparqlEmployeeCountByDepartmentCode';
import { defaultedPrefixes, RdfOntologyConfiguration } from '../../../models/eom/configuration/RdfOntologyConfiguration';

describe("sparqlEmployeeCountByDepartmentCode test", () => {
    let rdfOntologyDefinitions = plainToClass(RdfOntologyConfiguration, { prefixes: defaultedPrefixes});

    test("Returns valid query string", async () => {
        const asOfDate: Date = new Date();
        const departmentCode = "ABC";
        const query = sparqlEmployeeCountByDepartmentCodeQuery(rdfOntologyDefinitions, departmentCode, asOfDate);
        expect(query).toContain(departmentCode);
        expect(query).toContain(asOfDate.toISOString());
    });
});