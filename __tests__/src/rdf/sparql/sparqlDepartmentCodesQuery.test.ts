import { plainToClass } from 'class-transformer';
import 'reflect-metadata';
import { sparqlDepartmentCodesQuery } from '../../../../src/rdf/sparql/sparqlDepartmentCodesQuery';
import { defaultedPrefixes, RdfOntologyConfiguration } from '../../../models/eom/configuration/RdfOntologyConfiguration';

describe("SparqlDepartmentCodesQuery test", () => {
    let rdfOntologyDefinitions = plainToClass(RdfOntologyConfiguration, { prefixes: defaultedPrefixes});

    test("Returns valid query string", async () => {
        const asOfDate: Date = new Date()
        const query = sparqlDepartmentCodesQuery(rdfOntologyDefinitions, asOfDate);
        expect(query).toContain(asOfDate.toISOString());
    });
});