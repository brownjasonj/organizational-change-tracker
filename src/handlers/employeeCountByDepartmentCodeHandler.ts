import { Response } from "express";
import { DateTime } from "neo4j-driver";
import { Context, Request } from "openapi-backend";
import { IRdfGraphDB, SparqlQueryResultType } from "../persistence/IRdfGraphDB";
import { GraphPersistenceFactory } from "../persistence/GraphPersistenceFactory";
import { sparqlEmployeeCountByDepartmentCodeQuery2 } from "../rdf/sparql/sparqlEmployeeCountByDepartmentCode";

const graphDB: IRdfGraphDB =  GraphPersistenceFactory.getGraphDB();

const employeeCountByDepartmentCodeHandler = async (context: Context, request: Request, response: Response) => {
    if (context.request.query.departmentCode
        && context.request.query.asOf) {
        const sparqlQuery = sparqlEmployeeCountByDepartmentCodeQuery2(context.request.query.departmentCode as string, new Date(context.request.query.asOf as string));
        try {
            const data = await graphDB.sparqlQuery(sparqlQuery, SparqlQueryResultType.JSON);
            response.json(data)
            return;
        }
        catch (err) {
            console.log(err);
            response.status(500).json({err});
            return;
        }
    }
    response.status(400).json({error: 'Missing required parameters'});
}



export { employeeCountByDepartmentCodeHandler };