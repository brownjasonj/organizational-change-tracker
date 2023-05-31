import { Request, Response } from "express";
import { Context } from "openapi-backend";
import { IOrganizationRdfQuery } from "../../rdf/IOrganizationRdfQuery";

const employeeByEmployeeSystemIdHandler = (rdfOrganization: IOrganizationRdfQuery) => async (context: Context, request: Request, response: Response) => {
    if (context.request.params.employeesystemid) {
        try {
            const result = await rdfOrganization.getEmployeeByEmployeeSystemId(context.request.params.employeesystemid as string);
            console.log(result);
            response.json({ result: result});
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

export { employeeByEmployeeSystemIdHandler}