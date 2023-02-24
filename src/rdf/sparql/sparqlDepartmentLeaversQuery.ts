/*
    You are considered to have left a department on a specific point in time {date} if the following holds true

*/

const sparqlDepartmentLeaversQuery = (departmentCode: string, asOf: string) => {
    return `prefix : <http://example.org/bank-org#>
    prefix id: <http://example.org/bank-id#>
    PREFIX org: <http://www.w3.org/ns/org#>
    PREFIX time: <http://www.w3.org/2006/time#>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX foaf: <http://xmlns.com/foaf/0.1#>
    
    select ?employee 
    where {
        ?beginning time:inXSDDateTimeStamp ?startDateTime.
        filter(?startDateTime <= "${asOf}T00:00:00Z"^^xsd:dateTime).
        ?end time:inXSDDateTimeStamp ?endDateTime.
        filter(?endDateTime >= "${asOf}T23:59:59Z"^^xsd:dateTime).
        ?employeememberduring time:hasBeginning ?beginning.
        ?employeememberduring time:hasEnd ?end.


        select (count(?employee) as ?count)
        where {
            {
                select distinct ?employeememberduring
                where {
                    ?beginning time:inXSDDateTimeStamp ?startDateTime.
                    filter(?startDateTime <= "${asOf}T00:00:00Z"^^xsd:dateTime).
                    ?end time:inXSDDateTimeStamp ?endDateTime.
                    filter(?endDateTime >= "${asOf}T23:59:59Z"^^xsd:dateTime).
                    ?employeememberduring time:hasBeginning ?beginning.
                    ?employeememberduring time:hasEnd ?end.
                }
            }
            ?employeemember org:memberDuring ?employeememberduring.
            ?parentorg org:name "${departmentCode}".
            ?org org:subOrganizationOf* ?parentorg.
            ?employeemember org:organization ?org.
            ?employeemember org:member ?employee.
        }
    }`;
}

export { sparqlDepartmentLeaversQuery }