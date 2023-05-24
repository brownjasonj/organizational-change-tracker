
/**
 * A class that represents a SPARQL query definition.
 * This consists of a sparql query string and set of input parameters with types,
 * and a set of return values and types.
 */
class SparqlQueryDefinition {
    query: string;
    outputs: Map<string, string>;
    constructor(query: string, outputs: Map<string, string>) {
        this.query = query;
        this.outputs = outputs;
    }
}

export { SparqlQueryDefinition };