import { Response } from "express"
import { Context, Request } from "openapi-backend"
import { IRdfGraphDB, SparqlQueryResultType } from "../persistence/IRdfGraphDB";
import { GraphPersistenceFactory } from "../persistence/GraphPersistenceFactory";
import { sparqlEmployeeDepartmentHistoryQuery } from "../rdf/sparql/sparqlEmployeeDepartmentHistoryQuery";

const graphdb: IRdfGraphDB = GraphPersistenceFactory.getGraphDB();

const employeeDepartmentHistoryHandler = async (context: Context, request: Request, response: Response) => {
    await sparqlEmployeeDepartmentHistoryQuery(graphdb)
        .then((result) => {
            console.log(result);
            response.json(result);
        })
        .catch((error) => {
            console.log(error);
            response.status(500).json(error);
        });
}

export { employeeDepartmentHistoryHandler }