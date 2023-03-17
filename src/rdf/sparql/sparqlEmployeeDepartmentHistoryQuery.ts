import { EmployeeDepartmentEpoc } from "../../models/eom/EmployeeDepartmentEpoc";
import { EmployeeDepartmentEpocs } from "../../models/eom/EmployeeDepartmentEpocs";
import { IRdfGraphDB, SparqlQueryResultType } from "../../persistence/IRdfGraphDB";


const sparqlEmployeeDepartmentHistoryQuery = (): string => {
    return `prefix bank-org: <http://example.org/bank-org#>
    prefix bank-id: <http://example.org/bank-id#>
    prefix org: <http://www.w3.org/ns/org#>
    prefix time: <http://www.w3.org/2006/time#>
    prefix interval: <http://example.org/interval#>
    prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    prefix xsd: <http://www.w3.org/2001/XMLSchema#>
    
    select distinct ?pid ?department ?startDate ?endDate
    where {
        ?member org:organization ?org.              # find all members of the organization
          ?member org:member ?employee.
          ?employee bank-id:pid ?pid.
          ?org org:name ?department 
        {
          optional {
            select ?member (min(?date1) as ?startDate) (max(?date2) as ?endDate)
            where {
                  ?member org:memberDuring ?interval.			# determine when the member was a member of the organization
                  ?interval time:hasBeginning ?start.
                  ?interval time:hasEnd ?end.
                  ?start time:inXSDDateTimeStamp ?date1.
                    ?end time:inXSDDateTimeStamp ?date2.
            }
            group by ?member ?org ?startDate ?endDate
         } 
        }
    }`;
}

export { sparqlEmployeeDepartmentHistoryQuery }