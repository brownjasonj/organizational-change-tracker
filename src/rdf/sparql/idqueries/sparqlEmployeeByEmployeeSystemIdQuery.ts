import { RdfOntologyConfiguration } from "../../../models/eom/configuration/RdfOntologyConfiguration";

const sparqlEmployeeByEmployeeSystemIdQuery = (ontology: RdfOntologyConfiguration, employeeSystemId: string): string => {
  return `${ontology.getSparqlPrefixes()}
  
    select ?id
    where {
        ?employee ${ontology.getBankOrgPrefix()}pid "${employeeSystemId}".
        ?employee ${ontology.getBankOrgPrefix()}id ?id.
    }`;
}

export { sparqlEmployeeByEmployeeSystemIdQuery }