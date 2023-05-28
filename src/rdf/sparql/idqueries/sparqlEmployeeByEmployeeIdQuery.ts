import { RdfOntologyConfiguration } from "../../../models/eom/configuration/RdfOntologyConfiguration";

const sparqlEmployeeByEmployeeIdQuery = (ontology: RdfOntologyConfiguration, employeeId: string): string => {
  return `${ontology.getSparqlPrefixes()}
  
    select ?key ?value
    where {
      employee-id:${employeeId} ?key ?value.
    }`;
}
export { sparqlEmployeeByEmployeeIdQuery }