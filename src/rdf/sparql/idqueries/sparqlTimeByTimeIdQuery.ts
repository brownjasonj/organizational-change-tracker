import { RdfOntologyConfiguration } from "../../../models/eom/configuration/RdfOntologyConfiguration";

const sparqlTimeByTimeIdQuery = (ontology: RdfOntologyConfiguration, timeId: string): string => {
  return `${ontology.getSparqlPrefixes()}
  
    select ?key ?value
    where {
        ${ontology.getTimeDomainIdPrefix()}${timeId} ?key ?value.
    }`;
}

export { sparqlTimeByTimeIdQuery }