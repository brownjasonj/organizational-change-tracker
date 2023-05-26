import { ConfigurationManager } from "../../ConfigurationManager";
import { RdfOntologyConfiguration } from "../../models/eom/configuration/RdfOntologyConfiguration";

const sparqlEmployeesByDepartmentCodeAsOfDateQuery = (departmentCode: string, asOfDate: Date): string => {
  const ontology: RdfOntologyConfiguration = ConfigurationManager.getInstance().getApplicationConfiguration().getRdfOntologyConfiguration();
  return `${ontology.getSparqlPrefixes()}
  
    select distinct ?employee ?org
    where {
        ?parentorg ${ontology.getOrgPrefix()}name "${departmentCode}".                   #find parent organization with given name for which you want to count employees
        ?org ${ontology.getOrgPrefix()}subOrganizationOf* ?parentorg.     # where the organization is a suborganization of the parent organization
        ?member ${ontology.getOrgPrefix()}organization ?org.              # find all members of the organization
        ?member ${ontology.getOrgPrefix()}member ?employee.
        ?member ${ontology.getOrgPrefix()}memberDuring ?interval.			# determine when the member was a member of the organization
        ?interval ${ontology.getTimePrefix()}hasBeginning ?start.
        ?interval ${ontology.getTimePrefix()}hasEnd ?end.
        ?start ${ontology.getTimePrefix()}inXSDDateTimeStamp ?startDate.
        ?end ${ontology.getTimePrefix()}inXSDDateTimeStamp ?endDate.

        filter(?startDate <= "${asOfDate.toISOString()}"^^${ontology.getXsdPrefix()}dateTime
                && ?endDate >= "${asOfDate.toISOString()}"^^${ontology.getXsdPrefix()}dateTime).  
    }`;
}
export { sparqlEmployeesByDepartmentCodeAsOfDateQuery }