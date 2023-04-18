import { Response } from "express"
import { Context, Request } from "openapi-backend"
import { IRdfGraphDB, SparqlQueryResultType } from "../persistence/IRdfGraphDB";
import { GraphPersistenceFactory } from "../persistence/GraphPersistenceFactory";
import { sparqlRoleHistoryQuery } from "../rdf/sparql/sparqlRoleHistoryQuery";



const employeeRoleHistoryHandler = async (context: Context, request: Request, response: Response) => {
    if (context.request.query.employeeId) {
        const graphdb: IRdfGraphDB = GraphPersistenceFactory.getInstance().getGraphDB();
        const sparqlQuery = sparqlRoleHistoryQuery(context.request.query.employeeId as string);
        console.log(sparqlQuery);
        try {
            const result = await graphdb.sparqlQuery(sparqlQuery, SparqlQueryResultType.JSON);
            response.status(200).json({result: result});
        }
        catch (err) {
            console.log(err);
            response.status(500).json(err);
            return;
        }

    }
    response.json({ message: "done" });
}

export { employeeRoleHistoryHandler }