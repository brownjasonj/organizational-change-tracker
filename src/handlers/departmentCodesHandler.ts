import { Response } from "express";
import { Context, Request } from "openapi-backend";
import { BlazeGraph, BlazeGraphOptions, SparqlQueryResultType } from "../persistence/blazegraph/blazegraph";


const blazeGraphOptions: BlazeGraphOptions = new BlazeGraphOptions({});
const blazegraph: BlazeGraph = new BlazeGraph(new BlazeGraphOptions({}));

const getSparqlQuery = (asOf: string) => {
    return `prefix org: <http://www.w3.org/ns/org#>
    prefix time: <http://www.w3.org/2006/time#>
    prefix interval: <http://example.org/interval#>
    prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    prefix xsd: <http://www.w3.org/2000/01/rdf-schema#>
    
    select distinct ?name where {
        ?org rdf:type org:FormalOrganization.
        ?org org:name ?name.
        ?member org:organization ?org.              
        ?member org:memberDuring ?interval.         
        ?interval time:hasBeginning ?start.
        ?interval time:hasEnd ?end.
          ?start time:inXSDDateTime ?date1.
          ?end time:inXSDDateTime ?date2.
          filter (
            ?date1 <= "${asOf}"
            && ?date2 >= "${asOf}").
    }`;
}

const departmentCodesHandler = async (context: Context, request: Request, response: Response) => {
    if (request.query) {
        if (typeof(request.query === 'object')) {
            const queryParams: {[key: string]: string | string[]} = Object.assign({}, (Object)(request.query));
            const sparqlQuery = getSparqlQuery(queryParams['as-of'] as string);
            console.log("Accept: " + request.headers['accept']);
            console.log(sparqlQuery);
            blazegraph.sparqlQuery(sparqlQuery, SparqlQueryResultType.JSON)
            .then((data) => {
                response.json(data)
            });
        }
    }
}


const getContentType = (request: Request) => {
}

export { departmentCodesHandler} 