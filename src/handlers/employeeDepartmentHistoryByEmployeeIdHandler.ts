import { Response } from "express"
import { Context, Request } from "openapi-backend"
import { IOrganizationRdfQuery } from "../rdf/IOrganizationRdfQuery";
import { RdfGraphFactory } from "../rdf/RdfGraphFactory";

const employeeDepartmentHistoryByEmployeeIdHandler = async (context: Context, request: Request, response: Response) => {
    if (context.request.query.employeeId) {
        const rdfOrganization: IOrganizationRdfQuery = RdfGraphFactory.getInstance().getOrganizationRdfGraph();
        try {
            const result = await rdfOrganization.getEmployeeDepartmentHistoryByEmployeeId(context.request.query.employeeId as string);
            console.log(result);
            response.json(result);
        }
        catch (error) {
            console.log(error);
            response.status(500).json(error);
        }
    }
    else {
        response.json({ message: "done" });
    }
}

export { employeeDepartmentHistoryByEmployeeIdHandler }