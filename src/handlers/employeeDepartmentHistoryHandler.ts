import { Response } from "express"
import { Context, Request } from "openapi-backend"
import { IOrganizationRdfQuery } from "../rdf/IOrganizationRdfQuery";
import { RdfGraphFactory } from "../rdf/RdfGraphFactory";

const employeeDepartmentHistoryHandler = async (context: Context, request: Request, response: Response) => {
    const rdfOrganization: IOrganizationRdfQuery = RdfGraphFactory.getInstance().getOrganizationRdfGraph();
    try {
        const result = await rdfOrganization.getEmployeeDepartmentHistory();
        console.log(result);
        response.json(result);
    }
    catch (error) {
        console.log(error);
        response.status(500).json(error);
    }
}

export { employeeDepartmentHistoryHandler }