import { Response } from "express"
import { Context, Request } from "openapi-backend"
import { IOrganizationRdfQuery } from "../rdf/IOrganizationRdfQuery";
import { RdfGraphFactory } from "../rdf/RdfGraphFactory";

const departmentHistoryByEmployeeIdHandler = async (context: Context, request: Request, response: Response) => {
    if (context.request.params.employeeId) {
        const rdfOrganization: IOrganizationRdfQuery = RdfGraphFactory.getInstance().getOrganizationRdfGraph();
        try {
            const result = await rdfOrganization.getEmployeeDepartmentHistoryByEmployeeId(context.request.params.employeeId as string);
            response.json(result);
        }
        catch (error) {
            response.status(500).json(error);
        }
    }
    else {
        response.status(404).json({ message: "Missing EmployeeId" });
    }
}

export { departmentHistoryByEmployeeIdHandler }