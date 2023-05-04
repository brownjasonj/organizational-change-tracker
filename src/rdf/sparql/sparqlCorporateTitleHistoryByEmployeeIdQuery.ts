import { ConfigurationManager } from "../../ConfigurationManager";
import { RdfOntologyConfiguration } from "../../models/eom/configuration/RdfOntologyConfiguration";

const sparqlCorporateTitleHistoryByEmployeeIdQuery = (employeeId: string) => {
    const ontology: RdfOntologyConfiguration = ConfigurationManager.getInstance().getApplicationConfiguration().getRdfOntologyConfiguration();
    return `${ontology.getSparqlPrefixes()}
    select ?corpTitle (min(?date1) as ?startDate) (max(?date2) as ?endDate)
    where {
        ?employee ${ontology.getBankOrgPrefix()}pid "${employeeId}".
        ?corpTitleMembership ${ontology.getOrgPrefix()}member ?employee.
        ?corpTitleMembership ${ontology.getBankOrgPrefix()}BankCorporateTitle ?corpTitle.
        ?corpTitleMembership ${ontology.getOrgPrefix()}memberDuring ?interval.			# determine when the member was a member of the organization
        ?interval ${ontology.getTimePrefix()}hasBeginning ?start.
        ?interval ${ontology.getTimePrefix()}hasEnd ?end.
        ?start ${ontology.getTimePrefix()}inXSDDateTimeStamp ?date1.
        ?end ${ontology.getTimePrefix()}inXSDDateTimeStamp ?date2.
    }
    group by ?corpTitle ?startDate ?endDate`;
}

export { sparqlCorporateTitleHistoryByEmployeeIdQuery }
