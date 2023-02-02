import { Response } from "express";
import { DateTime } from "neo4j-driver";
import { Context, Request } from "openapi-backend";
import { BlazeGraph, BlazeGraphOptions, SparqlQueryResultType } from "../persistence/blazegraph/blazegraph";

const blazeGraphOptions: BlazeGraphOptions = new BlazeGraphOptions({});
const blazegraph: BlazeGraph = new BlazeGraph(new BlazeGraphOptions({}));

const getSparqlQuery = (departmentCode: string, asOf: string) => {
    return `prefix : <http://example.org/id#>
    prefix csorg: <http://example.org/org#>
    prefix foaf: <http://xmlns.com/foaf/0.1#>
    prefix org: <http://www.w3.org/ns/org#>
    prefix time: <http://www.w3.org/2006/time#>
    prefix pid: <http://example.org/pid#>
    prefix interval: <http://example.org/interval#>
    prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    prefix xsd: <http://www.w3.org/2000/01/rdf-schema#>
    
    SELECT  ?name
            (count(distinct ?member) as ?count)
    WHERE {
        ?parentorg org:name "${departmentCode}".                   #find parent organization with given name for which you want to count employees
        ?parentorg org:name ?name.
        ?member org:organization ?org.              # find all members of the organization
        ?org org:subOrganizationOf* ?parentorg.     # where the organization is a suborganization of the parent organization
        ?member org:memberDuring ?interval.         # determine when the member was a member of the organization
        ?interval time:hasBeginning ?start.
        ?interval time:hasEnd ?end.
        ?start time:inXSDDateTime ?date1.
        ?end time:inXSDDateTime ?date2.
        filter (
            ?date1 <= "${asOf}"
            && ?date2 >= "${asOf}").
    }
    GROUP BY ?name ?count
    `;
}


const getSparqlQuery2 = (departmentCode: string, asOf: string) => {
    return `prefix : <http://example.org/bank-org#>
    prefix sh: <http://www.w3.org/ns/shacl#>
    prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    prefix rdfs: <http://www.w3.org/2001/XMLSchema#>
    prefix xsd: <http://www.w3.org/2000/01/rdf-schema#>
    prefix id: <http://example.org/bank-id#>
    prefix pid: <http://example.org/bank-id#>
    prefix foaf: <http://xmlns.com/foaf/0.1#>
    prefix org: <http://www.w3.org/ns/org#>
    prefix time: <http://www.w3.org/2006/time#>


    construct {
        id:${asOf}-${departmentCode}-bankorgemployeecount a :bankOrganizationEmployeeCount;
        org:organization ?org;
        :bankOrganizationEmployeeCount ?count;
        time:inXSDDateTime "${asOf}"^^xsd:dateTime.
        } 
    where {
        {
        SELECT ?org
                (count(distinct ?member) as ?count)
        WHERE {
            ?parentorg org:name "${departmentCode}".
            ?member org:organization ?org.
            ?org org:subOrganizationOf* ?parentorg.
            ?member org:memberDuring ?interval.
            ?interval time:hasBeginning ?start.
            ?interval time:hasEnd ?end.
            ?start :dateTimeStamp ?startDateTime.
            ?end :dateTimeStamp ?endDateTime.
            filter (
                ?startDateTime <= "${asOf}"
                && ?endDateTime >= "${asOf}").
        }
        GROUP BY ?org ?count
        }
    }`;
}

const employeeCountByDepartmentCodeHandler = async (context: Context, request: Request, response: Response) => {
    if (request.query) {
        if (typeof(request.query === 'object')) {
            const queryParams: {[key: string]: string | string[]} = Object.assign({}, (Object)(request.query));
            const sparqlQuery = getSparqlQuery2(queryParams['department-code'] as string, queryParams['as-of'] as string);
            console.log(sparqlQuery);
            blazegraph.sparqlQuery(sparqlQuery, SparqlQueryResultType.JSON)
            .then((data) => {
                response.json(data);
            });
        }
    }
}



export { employeeCountByDepartmentCodeHandler };