import { sparqlDeleteAllTriples } from '../../../../src/rdf/sparql/sparqlDeleteAllTriples';

describe("sparqlDeleteAllTriples query string test", () => {
    test("Returns valid query string", async () => {
        const query = sparqlDeleteAllTriples();
        expect(query).toContain(query);
    });
});