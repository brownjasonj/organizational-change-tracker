import { ConfigurationManager } from "../../../ConfigurationManager";
import { RdfOntologyConfiguration } from "../../../models/eom/configuration/RdfOntologyConfiguration";

const sparqlEmployeeByEmployeeIdQuery = (employeeId: string): string => {
  const ontology: RdfOntologyConfiguration = ConfigurationManager.getInstance().getApplicationConfiguration().getRdfOntologyConfiguration();
  return `${ontology.getSparqlPrefixes()}
  
    select ?key ?value
    where {
      employee-id:${employeeId} ?key ?value.
    }`;
}
export { sparqlEmployeeByEmployeeIdQuery }