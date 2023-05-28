import { RdfOntologyConfiguration } from "../../models/eom/configuration/RdfOntologyConfiguration";

const sparqlDeleteAllTriples = (ontology: RdfOntologyConfiguration) => `
delete {
    ?s ?p ?o .
} where {
    ?s ?p ?o .
}`;

export { sparqlDeleteAllTriples };