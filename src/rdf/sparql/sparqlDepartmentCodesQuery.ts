import { RdfOntologyConfiguration } from "../../models/eom/configuration/RdfOntologyConfiguration";

const sparqlDepartmentCodesQuery = (ontology: RdfOntologyConfiguration, asOfDate: Date): string => {
    return `${ontology.getSparqlPrefixes()}
    
    select distinct ?name where {
        ?org ${ontology.getRdfPrefix()}type ${ontology.getOrgPrefix()}FormalOrganization.
        ?org ${ontology.getOrgPrefix()}name ?name.
        ?member ${ontology.getOrgPrefix()}organization ?org.              
        ?member ${ontology.getOrgPrefix()}memberDuring ?interval.         
        ?interval ${ontology.getTimePrefix()}hasBeginning ?start.
        ?interval ${ontology.getTimePrefix()}hasEnd ?end.
        ?start ${ontology.getTimePrefix()}inXSDDateTimeStamp ?date1.
        ?end ${ontology.getTimePrefix()}inXSDDateTimeStamp ?date2.
        filter (
            ?date1 <= "${asOfDate.toISOString()}"^^${ontology.getXsdPrefix()}dateTime
        && ?date2 >= "${asOfDate.toISOString()}"^^${ontology.getXsdPrefix()}dateTime).
    }`;
}

export { sparqlDepartmentCodesQuery }