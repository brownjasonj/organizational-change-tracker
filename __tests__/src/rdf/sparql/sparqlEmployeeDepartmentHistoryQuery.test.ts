import { plainToClass } from 'class-transformer';
import 'reflect-metadata';
import { sparqlEmployeeDepartmentHistoryQuery } from '../../../../src/rdf/sparql/sparqlEmployeeDepartmentHistoryQuery';
import { defaultedPrefixes, RdfOntologyConfiguration } from '../../../models/eom/configuration/RdfOntologyConfiguration';

describe("sparqlEmployeeDepartmentHistoryQuery test", () => {
    let rdfOntologyDefinitions = plainToClass(RdfOntologyConfiguration, { prefixes: defaultedPrefixes});

    test("Returns valid query string", async () => {
        const query = sparqlEmployeeDepartmentHistoryQuery(rdfOntologyDefinitions);
        expect(query).toContain(query);
    });
});