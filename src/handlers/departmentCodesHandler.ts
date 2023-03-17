import { Response } from "express";
import { Context, Request } from "openapi-backend";
import { IRdfGraphDB, SparqlQueryResultType } from "../persistence/IRdfGraphDB";
import { GraphPersistenceFactory } from "../persistence/GraphPersistenceFactory";
import { sparqlDepartmentCodesQuery } from "../rdf/sparql/sparqlDepartmentCodesQuery";

const graphdb: IRdfGraphDB = GraphPersistenceFactory.getGraphDB();

const departmentCodesHandler = async (context: Context, request: Request, response: Response) => {
    if (context.request.query.asOf) {
        const sparqlQuery = sparqlDepartmentCodesQuery(new Date(context.request.query.asOf as string))
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