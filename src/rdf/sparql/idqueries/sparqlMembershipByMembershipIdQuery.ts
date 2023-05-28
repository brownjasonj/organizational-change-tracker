import { RdfOntologyConfiguration } from "../../../models/eom/configuration/RdfOntologyConfiguration";

const sparqlMembershipByMembershipIdQuery = (ontology: RdfOntologyConfiguration, membershipId: string): string => {
  return `${ontology.getSparqlPrefixes()}
  
    select ?key ?value
    where {
        ${ontology.getMembershipDomainIdPrefix()}${membershipId} ?key ?value.
    }`;
}

export { sparqlMembershipByMembershipIdQuery }