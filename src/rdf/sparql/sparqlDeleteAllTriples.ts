const sparqlDeleteAllTriples = (graph: string) => `
delete {
    ?s ?p ?o .
} where {
    ?s ?p ?o .
}`;

export { sparqlDeleteAllTriples };