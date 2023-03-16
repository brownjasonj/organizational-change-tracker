import { Response } from "express"
import { Context, Request } from "openapi-backend"
import { IRdfGraphDB, SparqlQueryResultType } from "../persistence/IRdfGraphDB";
import { sparqlDepartmentJoinersQuery } from "../rdf/sparql/sparqlDepartmentJoinersQuery";
import { GraphPersistenceFactory } from "../persistence/GraphPersistenceFactory";
import { IOrganizationRdfQuery } from "../rdf/IOrganizationRdfQuery";
import { RdfGraphFactory } from "../rdf/RdfGraphFactory";


const employeeJoinersByDepartment = async (context: Context, request: Request, response: Response) => {
    const rdfOrganization: IOrganizationRdfQuery = RdfGraphFactory.getOrganizationRdfGraph();
    const graphDB: IRdfGraphDB =  GraphPersistenceFactory.getGraphDB();
    if (context.request.query.startDate
        && context.request.query.endDate
        && context.request.query.departmentCode) {
        
        try {
            const result = await rdfOrganization.getDepartmentJoiners(context.request.query.departmentCode as string,
                new Date(context.request.query.startDate as string),
                new Date(context.request.query.endDate as string));
                response.json({result: result});
                return;
        }
        catch (err) {
            console.log(err);
            response.status(500).json(err);
            return;
        }
        /*
        const sparqlQuery = sparqlDepartmentJoinersQuery(context.request.query.startDate as string, context.request.query.endDate as string);
        console.log(sparqlQuery);
        try {
            const result = await graphDB.sparqlQuery(sparqlQuery, SparqlQueryResultType.JSON);
            response.json({result: result});
        }
        catch (err) {
            console.log(err);
            response.status(500).json(err);
            return;
        }
        */
    }
    else {
        response.json({ message: "done" });
    }
}

export { employeeJoinersByDepartment }