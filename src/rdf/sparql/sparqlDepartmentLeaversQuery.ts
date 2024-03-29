/*
    You are considered to have left a department on a specific point in time {date} if the following holds true

*/
import { RdfOntologyConfiguration } from "../../models/eom/configuration/RdfOntologyConfiguration";

const sparqlDepartmentLeaversQuery = (ontology: RdfOntologyConfiguration, startPeriod: Date, endPeriod: Date) => {
    return `${ontology.getSparqlPrefixes()}
    
    select distinct ?pid ?department ?interval ?endDate
    where {
      ?member ${ontology.getOrgPrefix()}organization ?org.              # find all members of the organization
      ?member ${ontology.getOrgPrefix()}member ?employee.
      ?employee ${ontology.getBankOrgPrefix()}pid ?pid.
      ?org ${ontology.getOrgPrefix()}name ?department.
      ?member ${ontology.getOrgPrefix()}memberDuring ?interval.			# determine when the member was a member of the organization
      ?interval ${ontology.getTimePrefix()}hasEnd ?end.
      ?end ${ontology.getTimePrefix()}inXSDDateTimeStamp ?endDate.
      filter(?endDate >= "${startPeriod.toISOString()}"^^${ontology.getXsdPrefix()}dateTime
            && ?endDate <= "${endPeriod.toISOString()}"^^${ontology.getXsdPrefix()}dateTime).
    }`;
}

// const sparqlLeaversQueryByDepartment = (departmentCode: string, startPeriod: Date, endPeriod: Date) => {
//     const ontology: RdfOntologyConfiguration = ConfigurationManager.getInstance().getApplicationConfiguration().getRdfOntologyConfiguration();
//     return `${ontology.getSparqlPrefixes()}
    
//     select distinct ?pid ?department ?endingDate
//     where {
//         ?parentorg ${ontology.getOrgPrefix()}name "${departmentCode}".                   #find parent organization with given name for which you want to count employees
//         ?parentorg ${ontology.getOrgPrefix()}name ?name.
//         ?org ${ontology.getOrgPrefix()}subOrganizationOf* ?parentorg.
//         ?member ${ontology.getOrgPrefix()}organization ?org.              # find all members of the organization
//         ?member ${ontology.getOrgPrefix()}member ?employee.
//         ?employee ${ontology.getBankOrgPrefix()}pid ?pid.
//         ?org ${ontology.getOrgPrefix()}name ?department.
// 	    {
//             select ?member (min(?endDate) as ?endingDate)
//             where {
//                 ?member ${ontology.getOrgPrefix()}memberDuring ?interval.			# determine when the member was a member of the organization
//                 ?interval ${ontology.getTimePrefix()}hasEnd ?end.
//                 ?end ${ontology.getTimePrefix()}inXSDDateTimeStamp ?endDate.
//                 filter(?endDate >= "${startPeriod.toISOString()}"^^${ontology.getXsdPrefix()}dateTime
//                     && ?endDate <= "${endPeriod.toISOString()}"^^${ontology.getXsdPrefix()}dateTime).
//             }
//             group by ?member ?endingDate
//         }
//     }`;
// };


const sparqlLeaversQueryByDepartment = (ontology: RdfOntologyConfiguration, departmentCode: string, startPeriod: Date, endPeriod: Date) => {
    return `${ontology.getSparqlPrefixes()}
    
    select distinct ?employee ?department ?endingDate
    where {
        ?parentorg ${ontology.getOrgPrefix()}name "${departmentCode}".                   #find parent organization with given name for which you want to count employees
        ?org ${ontology.getOrgPrefix()}subOrganizationOf* ?parentorg.
        ?member ${ontology.getOrgPrefix()}organization ?org.              # find all members of the organization
	    {
            select ?member (max(?endDate) as ?endingDate)
            where {
                ?member ${ontology.getOrgPrefix()}organization ?org.              # find all members of the organization
                ?member ${ontology.getOrgPrefix()}memberDuring ?interval.			# determine when the member was a member of the organization
                ?interval ${ontology.getTimePrefix()}hasEnd ?end.
                ?end ${ontology.getTimePrefix()}inXSDDateTimeStamp ?endDate.
            }
            group by ?member ?endingDate
        }
        filter(?endingDate >= "${startPeriod.toISOString()}"^^${ontology.getXsdPrefix()}dateTime
            && ?endingDate <= "${endPeriod.toISOString()}"^^${ontology.getXsdPrefix()}dateTime).
        ?member ${ontology.getOrgPrefix()}member ?employee.
        ?org ${ontology.getOrgPrefix()}name ?department.
    }`;
};

export { sparqlDepartmentLeaversQuery, sparqlLeaversQueryByDepartment }