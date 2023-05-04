import { ConfigurationManager } from "../../ConfigurationManager";
import { EmployeeDepartmentEpoc } from "../../models/eom/EmployeeDepartmentEpoc";
import { EmployeeDepartmentEpocs } from "../../models/eom/EmployeeDepartmentEpocs";
import { RdfOntologyConfiguration } from "../../models/eom/configuration/RdfOntologyConfiguration";
import { IRdfGraphDB, SparqlQueryResultType } from "../../persistence/IRdfGraphDB";


const sparqlEmployeeDepartmentHistoryQueryByEmployeeId = (employeeId: string): string => {
    const ontology: RdfOntologyConfiguration = ConfigurationManager.getInstance().getApplicationConfiguration().getRdfOntologyConfiguration();
    return `${ontology.getSparqlPrefixes()}
    
    select distinct ?department (min(?date1) as ?startDate) (max(?date2) as ?endDate)
    where {
        ?employee ${ontology.getBankOrgPrefix()}pid "${employeeId}".
        ?member ${ontology.getOrgPrefix()}member ?employee.
        ?member ${ontology.getOrgPrefix()}organization ?org.              # find all members of the organization
        ?org ${ontology.getOrgPrefix()}name ?department.
        ?member ${ontology.getOrgPrefix()}memberDuring ?interval.			# determine when the member was a member of the organization
        ?interval ${ontology.getTimePrefix()}hasBeginning ?start.
        ?interval ${ontology.getTimePrefix()}hasEnd ?end.
        ?start ${ontology.getTimePrefix()}inXSDDateTimeStamp ?date1.
        ?end ${ontology.getTimePrefix()}inXSDDateTimeStamp ?date2.
    }
    group by ?member ?department ?startDate ?endDate`;
}

export { sparqlEmployeeDepartmentHistoryQueryByEmployeeId }