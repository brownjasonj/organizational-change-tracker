import { RdfOntologyConfiguration } from "../../models/eom/configuration/RdfOntologyConfiguration";

const sparqlDepartmentHistoryQuery = (ontology: RdfOntologyConfiguration, departmentCode: string, startDate: Date, endDate: Date): string => {
    return `${ontology.getSparqlPrefixes()}
      
    SELECT  ?name
            (count(distinct ?member) as ?count)
    WHERE {
        ?parentorg ${ontology.getOrgPrefix()}name "${departmentCode}".                   #find parent organization with given name for which you want to count employees
        ?parentorg ${ontology.getOrgPrefix()}name ?name.
        ?member ${ontology.getOrgPrefix()}organization ?org.              # find all members of the organization
        ?org ${ontology.getOrgPrefix()}subOrganizationOf* ?parentorg.     # where the organization is a suborganization of the parent organization
        ?member ${ontology.getOrgPrefix()}memberDuring ?interval.         # determine when the member was a member of the organization
        ?interval ${ontology.getTimePrefix()}hasBeginning ?start.
        ?interval ${ontology.getTimePrefix()}hasEnd ?end.
        ?start ${ontology.getTimePrefix()}inXSDDateTimeStamp ?date1.
        ?end ${ontology.getTimePrefix()}inXSDDateTimeStamp ?date2.
        filter (
            ?date1 <= "${startDate.toISOString()}"^^${ontology.getXsdPrefix()}dateTime
            && ?date2 >= "${endDate.toISOString()}"^^${ontology.getXsdPrefix()}dateTime).
    }
    GROUP BY ?name ?count
    `;
}





export { sparqlDepartmentHistoryQuery }