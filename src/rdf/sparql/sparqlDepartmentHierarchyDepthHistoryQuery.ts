import { RdfOntologyConfiguration } from "../../models/eom/configuration/RdfOntologyConfiguration";

const sparqlDepartmentHierarchyDepthHistoryQuery = (ontology: RdfOntologyConfiguration, departmentCode: string, hierarchyDepth: number, startDate: Date): string => {
    return `${ontology.getSparqlPrefixes()}
    
    select ?root_name ?root ?sub_name ?sub (count(?mid) as ?distance)
    where { 
        ?super ${ontology.getOrgPrefix()}name "${departmentCode}".
        ?root ${ontology.getOrgPrefix()}subOrganizationOf* ?super.
        ?root ${ontology.getOrgPrefix()}name ?root_name.
        ?mid ${ontology.getOrgPrefix()}subOrganizationOf* ?root .
        ?sub ${ontology.getOrgPrefix()}subOrganizationOf+ ?mid .
        ?sub ${ontology.getOrgPrefix()}name ?sub_name.
    }
    group by ?root_name ?root ?sub_name ?sub 
    order by ?root ?sub
    `;
}

export { sparqlDepartmentHierarchyDepthHistoryQuery }


/*

    select ?root ?child (count(?parent) as ?distance)
    where { 
        ?parent org:subOrganizationOf* ?root.
        ?child org:subOrganizationOf+ ?parent.
    }
    group by ?root ?child 
    order by ?root ?child


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
*/




