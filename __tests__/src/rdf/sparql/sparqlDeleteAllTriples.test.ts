import { plainToClass } from 'class-transformer';
import { sparqlDeleteAllTriples } from '../../../../src/rdf/sparql/sparqlDeleteAllTriples';
import { defaultedPrefixes, RdfOntologyConfiguration } from '../../../models/eom/configuration/RdfOntologyConfiguration';

describe("sparqlDeleteAllTriples query string test", () => {
    let rdfOntologyDefinitions = plainToClass(RdfOntologyConfiguration, { prefixes: defaultedPrefixes});

    test("Returns valid query string", async () => {
        const query = sparqlDeleteAllTriples(rdfOntologyDefinitions);
        expect(query).toContain(query);
    });
});