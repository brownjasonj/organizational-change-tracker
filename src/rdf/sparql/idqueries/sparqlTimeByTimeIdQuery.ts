import { ConfigurationManager } from "../../../ConfigurationManager";
import { EmployeeDepartmentEpoc } from "../../../models/eom/EmployeeDepartmentEpoc";
import { EmployeeDepartmentEpocs } from "../../../models/eom/EmployeeDepartmentEpocs";
import { RdfOntologyConfiguration } from "../../../models/eom/configuration/RdfOntologyConfiguration";
import { IRdfGraphDB, SparqlQueryResultType } from "../../../persistence/IRdfGraphDB";


const sparqlTimeByTimeIdQuery = (timeId: string): string => {
  const ontology: RdfOntologyConfiguration = ConfigurationManager.getInstance().getApplicationConfiguration().getRdfOntologyConfiguration();
  return `${ontology.getSparqlPrefixes()}
  
    select ?dateTime
    where {
        ${ontology.getTimeDomainIdPrefix()}${timeId} ${ontology.getTimePrefix()}inXSDDateTimeStamp ?dateTime.
    }`;
}

export { sparqlTimeByTimeIdQuery }