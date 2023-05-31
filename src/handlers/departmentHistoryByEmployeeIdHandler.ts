import { Response } from "express"
import { Context, Request } from "openapi-backend"
import { IOrganizationRdfQuery } from "../rdf/IOrganizationRdfQuery";

const departmentHistoryByEmployeeIdHandler =  (rdfOrganization: IOrganizationRdfQuery) => async (context: Context, request: Request, response: Response) => {
    if (context.request.params.employeeid) {
        try {
            const result = await rdfOrganization.getEmployeeDepartmentHistoryByEmployeeId(context.request.params.employeeid as string);
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