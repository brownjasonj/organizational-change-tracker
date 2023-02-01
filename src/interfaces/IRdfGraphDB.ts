
enum SparqlQueryResultType {
    CSV = "text/csv",
    TSV = "text/tsv",
    JSON = "application/sparql-results+json",
    XML = "application/sparql-results+xml",
    TABLE = "application/x-binary-rdf-results-table"
}

interface IRdfGraphDB {
    sparqlQuery: (query: string, resultType: SparqlQueryResultType) => Promise<any>;
    turtleUpdate: (turtle: string) => Promise<any>;
}

export { SparqlQueryResultType, IRdfGraphDB }