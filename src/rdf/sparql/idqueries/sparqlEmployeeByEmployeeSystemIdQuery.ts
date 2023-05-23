import { ConfigurationManager } from "../../../ConfigurationManager";
import { RdfOntologyConfiguration } from "../../../models/eom/configuration/RdfOntologyConfiguration";


const sparqlEmployeeByEmployeeSystemIdQuery = (employeeSystemId: string): string => {
  const ontology: RdfOntologyConfiguration = ConfigurationManager.getInstance().getApplicationConfiguration().getRdfOntologyConfiguration();
  return `${ontology.getSparqlPrefixes()}
  
    select ?id
    where {
        ?employee ${ontology.getBankOrgPrefix()}pid "${employeeSystemId}".
        ?employee ${ontology.getBankOrgPrefix()}id ?id.
    }`;
}

export { sparqlEmployeeByEmployeeSystemIdQuery }