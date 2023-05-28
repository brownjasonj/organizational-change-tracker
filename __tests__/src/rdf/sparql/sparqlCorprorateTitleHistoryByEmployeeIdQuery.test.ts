import { plainToClass } from 'class-transformer';
import 'reflect-metadata';
import { sparqlCorporateTitleHistoryByEmployeeIdQuery } from "../../../rdf/sparql/sparqlCorporateTitleHistoryByEmployeeIdQuery";
import { defaultedPrefixes, RdfOntologyConfiguration } from '../../../models/eom/configuration/RdfOntologyConfiguration';

describe("SparqlCorporateTitleHistoryByEmployeeIdQuery test", () => {
    let rdfOntologyDefinitions = plainToClass(RdfOntologyConfiguration, { prefixes: defaultedPrefixes});
    test("Returns valid query string", async () => {
        const query = sparqlCorporateTitleHistoryByEmployeeIdQuery(rdfOntologyDefinitions, "123456789");
        expect(query).toContain("123456789");
    });
});