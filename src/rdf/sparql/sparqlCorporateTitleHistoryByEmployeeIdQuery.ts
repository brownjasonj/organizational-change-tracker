import { ConfigurationManager } from "../../ConfigurationManager";

const sparqlCorporateTitleHistoryByEmployeeIdQuery = (employeeId: string) => {
    return `${ConfigurationManager.getInstance().getApplicationConfiguration().getRdfOntologyConfiguration().getSparqlPrefixes()}
    select ?corpTitle (min(?date1) as ?startDate) (max(?date2) as ?endDate)
    where {
        ?employee bank-id:pid "${employeeId}".
        ?corpTitleMembership org:member ?employee.
        ?corpTitleMembership bank-org:BankCorporateTitle ?corpTitle.
        ?corpTitleMembership org:memberDuring ?interval.			# determine when the member was a member of the organization
        ?interval time:hasBeginning ?start.
        ?interval time:hasEnd ?end.
        ?start time:inXSDDateTimeStamp ?date1.
        ?end time:inXSDDateTimeStamp ?date2.
    }
    group by ?corpTitle ?startDate ?endDate`;
}

export { sparqlCorporateTitleHistoryByEmployeeIdQuery }
