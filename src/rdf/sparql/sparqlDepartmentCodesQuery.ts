const sparqlDepartmentCodesQuery = (asOfDate: Date): string => {
    return `prefix org: <http://www.w3.org/ns/org#>
    prefix time: <http://www.w3.org/2006/time#>
    prefix interval: <http://example.org/interval#>
    prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    prefix xsd: <http://www.w3.org/2001/XMLSchema#>
    
    select distinct ?name where {
        ?org rdf:type org:FormalOrganization.
        ?org org:name ?name.
        ?member org:organization ?org.              
        ?member org:memberDuring ?interval.         
        ?interval time:hasBeginning ?start.
        ?interval time:hasEnd ?end.
        ?start time:inXSDDateTimeStamp ?date1.
        ?end time:inXSDDateTimeStamp ?date2.
        filter (
        ?date1 <= "${asOfDate.toISOString()}"^^xsd:dateTime
        && ?date2 >= "${asOfDate.toISOString()}"^^xsd:dateTime).
    }`;
}

export { sparqlDepartmentCodesQuery }