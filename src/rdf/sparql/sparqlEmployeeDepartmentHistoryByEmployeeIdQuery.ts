import { RdfOntologyConfiguration } from "../../models/eom/configuration/RdfOntologyConfiguration";

const sparqlEmployeeDepartmentHistoryQueryByEmployeeId = (ontology: RdfOntologyConfiguration, employeeId: string): string => {
    return `${ontology.getSparqlPrefixes()}
    
    select distinct ?department (min(?date1) as ?startDate) (max(?date2) as ?endDate)
    where {
        ?member ${ontology.getOrgPrefix()}member ${ontology.getEmployeeDomainIdPrefix()}${employeeId}.
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