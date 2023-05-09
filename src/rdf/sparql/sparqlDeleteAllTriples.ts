const sparqlDeleteAllTriples = () => `
delete {
    ?s ?p ?o .
} where {
    ?s ?p ?o .
}`;

export { sparqlDeleteAllTriples };