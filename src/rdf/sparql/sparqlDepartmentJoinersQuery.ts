/*
    You are considered to have left a department on a specific point in time {date} if the following holds true

*/

import { ConfigurationManager } from "../../ConfigurationManager";
import { RdfOntologyConfiguration } from "../../models/eom/configuration/RdfOntologyConfiguration";

const sparqlDepartmentJoinersQuery = (startDate: Date, endDate: Date) => {
    const ontology: RdfOntologyConfiguration = ConfigurationManager.getInstance().getApplicationConfiguration().getRdfOntologyConfiguration();
    return `${ontology.getSparqlPrefixes()}
    
    select distinct ?pid ?department ?startDate
    where {
      ?member ${ontology.getOrgPrefix()}organization ?org.              # find all members of the organization
      ?member ${ontology.getOrgPrefix()}member ?employee.
      ?employee ${ontology.getBankOrgPrefix()}pid ?pid.
      ?org ${ontology.getOrgPrefix()}name ?department.
      ?member ${ontology.getOrgPrefix()}memberDuring ?interval.			# determine when the member was a member of the organization
      ?interval ${ontology.getTimePrefix()}hasBeginning ?start.
      ?start ${ontology.getTimePrefix()}inXSDDateTimeStamp ?startDate.
      filter(?startDate >= "${startDate.toISOString()}"^^${ontology.getXsdPrefix()}dateTime
            && ?startDate <= "${endDate.toISOString()}"^^${ontology.getXsdPrefix()}dateTime).
    }`;
}

const sparqlJoinersQueryByDepartment = (departmentCode: string, startDate: Date, endDate: Date) => {
    const ontology: RdfOntologyConfiguration = ConfigurationManager.getInstance().getApplicationConfiguration().getRdfOntologyConfiguration();
    return `${ontology.getSparqlPrefixes()}
    
    select distinct ?pid ?department ?startingDate
    where {
        ?parentorg ${ontology.getOrgPrefix()}name "${departmentCode}".                   #find parent organization with given name for which you want to count employees
        ?parentorg ${ontology.getOrgPrefix()}name ?name.
        ?org ${ontology.getOrgPrefix()}subOrganizationOf* ?parentorg.
        ?member ${ontology.getOrgPrefix()}organization ?org.              # find all members of the organization
        ?member ${ontology.getOrgPrefix()}member ?employee.
        ?employee ${ontology.getBankOrgPrefix()}pid ?pid.
        ?org ${ontology.getOrgPrefix()}name ?department.
	    {
            select ?member (min(?startDate) as ?startingDate)
            where {
                ?member ${ontology.getOrgPrefix()}memberDuring ?interval.			# determine when the member was a member of the organization
                ?interval ${ontology.getTimePrefix()}hasBeginning ?start.
                ?start ${ontology.getTimePrefix()}inXSDDateTimeStamp ?startDate.
                filter(?startDate >= "${startDate.toISOString()}"^^${ontology.getXsdPrefix()}dateTime
                        && ?startDate <= "${endDate.toISOString()}"^^${ontology.getXsdPrefix()}dateTime).
                }
            group by ?member ?startingDate
        }
    }`;
};

export { sparqlDepartmentJoinersQuery, sparqlJoinersQueryByDepartment }