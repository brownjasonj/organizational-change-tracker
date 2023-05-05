import { ConfigurationManager } from "../../../ConfigurationManager";
import { EmployeeDepartmentEpoc } from "../../../models/eom/EmployeeDepartmentEpoc";
import { EmployeeDepartmentEpocs } from "../../../models/eom/EmployeeDepartmentEpocs";
import { RdfOntologyConfiguration } from "../../../models/eom/configuration/RdfOntologyConfiguration";
import { IRdfGraphDB, SparqlQueryResultType } from "../../../persistence/IRdfGraphDB";


const sparqlOrganizationByOrganizationIdQuery = (organizationId: string): string => {
  const ontology: RdfOntologyConfiguration = ConfigurationManager.getInstance().getApplicationConfiguration().getRdfOntologyConfiguration();
  return `${ontology.getSparqlPrefixes()}
  
    select ?orgName
    where {
        ${ontology.getOrganizationIdPrefix()}${organizationId} ${ontology.getOrgPrefix()}name ?orgName.
    }`;
}

export { sparqlOrganizationByOrganizationIdQuery }