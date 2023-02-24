const sparqlEmployeeCountByDepartmentCodeQuery = (departmentCode: string, asOf: string) => {
    return `prefix : <http://example.org/id#>
    prefix csorg: <http://example.org/org#>
    prefix foaf: <http://xmlns.com/foaf/0.1#>
    prefix org: <http://www.w3.org/ns/org#>
    prefix time: <http://www.w3.org/2006/time#>
    prefix pid: <http://example.org/pid#>
    prefix interval: <http://example.org/interval#>
    prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    prefix xsd: <http://www.w3.org/2000/01/rdf-schema#>
    
    SELECT  ?name
            (count(distinct ?member) as ?count)
    WHERE {
        ?parentorg org:name "${departmentCode}".                   #find parent organization with given name for which you want to count employees
        ?parentorg org:name ?name.
        ?member org:organization ?org.              # find all members of the organization
        ?org org:subOrganizationOf* ?parentorg.     # where the organization is a suborganization of the parent organization
        ?member org:memberDuring ?interval.         # determine when the member was a member of the organization
        ?interval time:hasBeginning ?start.
        ?interval time:hasEnd ?end.
        ?start time:inXSDDateTime ?date1.
        ?end time:inXSDDateTime ?date2.
        filter (
            ?date1 <= "${asOf}"
            && ?date2 >= "${asOf}").
    }
    GROUP BY ?name ?count
    `;
}


const sparqlEmployeeCountByDepartmentCodeQuery2 = (departmentCode: string, asOf: string) => {
    return `prefix : <http://example.org/bank-org#>
    prefix id: <http://example.org/bank-id#>
    PREFIX org: <http://www.w3.org/ns/org#>
    PREFIX time: <http://www.w3.org/2006/time#>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX foaf: <http://xmlns.com/foaf/0.1#>
    
    construct {
        id:a-org-employee-count a :bankOrganizationEmployeeCount;
        org:organization ?org;
        :bankOrganizationEmployeeCount ?count;
        time:inXSDDateTime "2013-01-01T00:00:00.000Z"^^xsd:dateTime.
          }
    where {
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

const sparqlEmployeeCountByDepartmentCodeQuery3 = (departmentCode: string, asOf: string) => {
    return `prefix : <http://example.org/bank-org#>

            construct {
                ?employee rdf:type :BankEmployee
            }
            where {
                ?employee rdf:type :BankEmployee.
            }
        `
}

export { sparqlEmployeeCountByDepartmentCodeQuery, sparqlEmployeeCountByDepartmentCodeQuery2, sparqlEmployeeCountByDepartmentCodeQuery3 }