import { Response } from "express";
import { DateTime } from "neo4j-driver";
import { Context, Request } from "openapi-backend";
import { BlazeGraph, BlazeGraphOptions, SparqlQueryResultType } from "../blazegraph/blazegraph";

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
            (count(?member) as ?count)
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
    GROUP BY ?name
    `;
}

const employeeCountByDepartmentCodeHandler = async (context: Context, request: Request, response: Response) => {
    if (request.query) {
        if (typeof(request.query === 'object')) {
            const queryParams: {[key: string]: string | string[]} = Object.assign({}, (Object)(request.query));
            console.log(queryParams['department-code']);
            console.log(queryParams['as-of']);
            console.log(getSparqlQuery(queryParams['department-code'] as string, queryParams['as-of'] as string));
            blazegraph.sparqlQuery(getSparqlQuery(queryParams['department-code'] as string, queryParams['as-of'] as string), SparqlQueryResultType.JSON)
            .then((data) => {
                console.log(JSON.stringify(data));
            });
        }
    }
    response.json({ message: "done" });
}

export { employeeCountByDepartmentCodeHandler };