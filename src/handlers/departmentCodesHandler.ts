import { Response } from "express";
import { Context, Request } from "openapi-backend";
import { IRdfGraphDB, SparqlQueryResultType } from "../interfaces/IRdfGraphDB";
import { GraphPersistenceFactory } from "../persistence/GraphPersistenceFactory";

const graphdb: IRdfGraphDB = GraphPersistenceFactory.getGraphDB();

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
    if (context.request.query.asOf) {
        const sparqlQuery = getSparqlQuery(context.request.query.asOf as string);
        if (context.request.headers.accept === 'application/json') {
            console.log('sparqlQuery: ' + sparqlQuery);
            try {
                const result = await graphdb.sparqlQuery(sparqlQuery, SparqlQueryResultType.JSON);
                response.json(result);
                return;
            }
            catch (error) {
                console.log(error);
                response.status(500).send();
                return;
            }
        }
    }
    response.status(404).send();
}


const getContentType = (request: Request) => {
}

export { departmentCodesHandler} 