const sparqlCorporateTitleHistoryByEmployeeIdQuery = (employeeId: string) => {
    return `prefix bank-org: <http://example.org/bank-org#>
    prefix bank-id: <http://example.org/bank-id#>
    prefix org: <http://www.w3.org/ns/org#>
    prefix time: <http://www.w3.org/2006/time#>
    prefix interval: <http://example.org/interval#>
    prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    prefix xsd: <http://www.w3.org/2001/XMLSchema#>
    
    select  distinct ?employee ?corpTitle ?startDate ?endDate
	where {
        ?employee rdf:type bank-org:BankEmployee.
		?corpTitleMembership org:member ?employee.
        ?employee bank-id:pid "${employeeId}".
        ?corpTitleMembership bank-org:BankCorporateTitle ?corpTitle.
        {
            optional {
              select ?corpTitleMembership (min(?date1) as ?startDate) (max(?date2) as ?endDate)
              where {
                    ?corpTitleMembership org:memberDuring ?interval.			# determine when the member was a member of the organization
                    ?interval time:hasBeginning ?start.
                    ?interval time:hasEnd ?end.
                    ?start time:inXSDDateTimeStamp ?date1.
                      ?end time:inXSDDateTimeStamp ?date2.
              }
              group by ?corpTitleMembership ?org ?startDate ?endDate
           } 
          }
    }`;
}

export { sparqlCorporateTitleHistoryByEmployeeIdQuery }