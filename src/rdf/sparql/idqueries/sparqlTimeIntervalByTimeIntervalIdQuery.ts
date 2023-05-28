import { RdfOntologyConfiguration } from "../../../models/eom/configuration/RdfOntologyConfiguration";

const sparqlTimeIntervalByTimeIntervalId = (ontology: RdfOntologyConfiguration, timeIntervalId: string): string => {
  return `${ontology.getSparqlPrefixes()}
  
    select ?key ?value
    where {
        ${ontology.getTimeIntervalDomainIdPrefix()}${timeIntervalId} ?key ?value.
    }`;
}

export { sparqlTimeIntervalByTimeIntervalId }