/*
    You are considered to have left a department on a specific point in time {date} if the following holds true

*/

const sparqlDepartmentLeaversQuery = (startPeriod: Date, endPeriod: Date) => {
    return `prefix bank-org: <http://example.org/bank-org#>
    prefix bank-id: <http://example.org/bank-id#>
    prefix org: <http://www.w3.org/ns/org#>
    prefix time: <http://www.w3.org/2006/time#>
    prefix interval: <http://example.org/interval#>
    prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    prefix xsd: <http://www.w3.org/2001/XMLSchema#>
    
    select distinct ?pid ?department ?interval ?endDate
    where {
      ?member org:organization ?org.              # find all members of the organization
      ?member org:member ?employee.
      ?employee bank-id:pid ?pid.
      ?org org:name ?department.
      ?member org:memberDuring ?interval.			# determine when the member was a member of the organization
      ?interval time:hasEnd ?end.
      ?end time:inXSDDateTimeStamp ?endDate.
      filter(?endDate >= "${startPeriod.toISOString()}"^^xsd:dateTime
            && ?endDate <= "${endPeriod.toISOString()}"^^xsd:dateTime).
    }`;
}

const sparqlLeaversQueryByDepartment = (departmentCode: string, startPeriod: Date, endPeriod: Date) => {
    return `prefix bank-org: <http://example.org/bank-org#>
    prefix bank-id: <http://example.org/bank-id#>
    prefix org: <http://www.w3.org/ns/org#>
    prefix time: <http://www.w3.org/2006/time#>
    prefix interval: <http://example.org/interval#>
    prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    prefix xsd: <http://www.w3.org/2001/XMLSchema#>
    
    select distinct ?pid ?department ?endingDate
    where {
        ?parentorg org:name "${departmentCode}".                   #find parent organization with given name for which you want to count employees
        ?parentorg org:name ?name.
        ?org org:subOrganizationOf* ?parentorg.
        ?member org:organization ?org.              # find all members of the organization
        ?member org:member ?employee.
        ?employee bank-id:pid ?pid.
        ?org org:name ?department.
	    {
            select ?member (min(?endDate) as ?endingDate)
            where {
                ?member org:memberDuring ?interval.			# determine when the member was a member of the organization
                ?interval time:hasEnd ?end.
                ?end time:inXSDDateTimeStamp ?endDate.
                filter(?endDate >= "${startPeriod.toISOString()}"^^xsd:dateTime
                    && ?endDate <= "${endPeriod.toISOString()}"^^xsd:dateTime).
            }
            group by ?member ?endingDate
        }
    }`;
};

export { sparqlDepartmentLeaversQuery, sparqlLeaversQueryByDepartment }