import { ConfigurationManager } from "../../../ConfigurationManager";
import { EmployeeDepartmentEpoc } from "../../../models/eom/EmployeeDepartmentEpoc";
import { EmployeeDepartmentEpocs } from "../../../models/eom/EmployeeDepartmentEpocs";
import { RdfOntologyConfiguration } from "../../../models/eom/configuration/RdfOntologyConfiguration";
import { IRdfGraphDB, SparqlQueryResultType } from "../../../persistence/IRdfGraphDB";


const sparqlEmployeeByEmployeeIdQuery = (employeeId: string): string => {
  const ontology: RdfOntologyConfiguration = ConfigurationManager.getInstance().getApplicationConfiguration().getRdfOntologyConfiguration();
  return `${ontology.getSparqlPrefixes()}
  
    select ?id ?firstName ?lastName
    where {
        ?employee ${ontology.getBankOrgPrefix()}pid "${employeeId}".
        ?employee ${ontology.getBankOrgPrefix()}id ?id.
        ?employee ${ontology.getFoafPrefix()}firstName ?firstName.
        ?employee ${ontology.getFoafPrefix()}surname ?lastName.
    }`;
}

export { sparqlEmployeeByEmployeeIdQuery }