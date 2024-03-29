import { RdfOntologyConfiguration } from "../../models/eom/configuration/RdfOntologyConfiguration";

const sparqlEmployeeDepartmentHistoryQuery = (ontology: RdfOntologyConfiguration): string => {
  return `${ontology.getSparqlPrefixes()}
  
    select distinct ?pid ?department ?startDate ?endDate
    where {
        ?member ${ontology.getOrgPrefix()}organization ?org.              # find all members of the organization
        ?member ${ontology.getOrgPrefix()}member ?employee.
        ?employee ${ontology.getBankOrgPrefix()}pid ?pid.
        ?org ${ontology.getOrgPrefix()}name ?department 
        {
          optional {
            select ?member (min(?date1) as ?startDate) (max(?date2) as ?endDate)
            where {
                  ?member ${ontology.getOrgPrefix()}memberDuring ?interval.			# determine when the member was a member of the organization
                  ?interval ${ontology.getTimePrefix()}hasBeginning ?start.
                  ?interval ${ontology.getTimePrefix()}hasEnd ?end.
                  ?start ${ontology.getTimePrefix()}inXSDDateTimeStamp ?date1.
                    ?end ${ontology.getTimePrefix()}inXSDDateTimeStamp ?date2.
            }
            group by ?member ?org ?startDate ?endDate
         } 
        }
    }`;
}

export { sparqlEmployeeDepartmentHistoryQuery }