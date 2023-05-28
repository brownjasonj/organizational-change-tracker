import { RdfOntologyConfiguration } from "../../../models/eom/configuration/RdfOntologyConfiguration";

const sparqlOrganizationByOrganizationIdQuery = (ontology: RdfOntologyConfiguration, organizationId: string): string => {
  return `${ontology.getSparqlPrefixes()}
  
    select ?key ?value
    where {
        ${ontology.getOrganizationIdPrefix()}${organizationId} ?key ?value.
    }`;
}

export { sparqlOrganizationByOrganizationIdQuery }