import { Request, Response } from "express";
import { Context, Handler } from "openapi-backend";
import { IOrganizationRdfQuery } from "../../rdf/IOrganizationRdfQuery";
import { RdfGraphFactory } from "../../rdf/RdfGraphFactory";

const employeeByEmployeeIdHandler = (rdfOrganization: IOrganizationRdfQuery) => async (context: Context, request: Request, response: Response) => {
    if (context.request.params.employeeid) {
        // const rdfOrganization: IOrganizationRdfQuery = RdfGraphFactory.getInstance().getOrganizationRdfGraph();
        try {
            const result = await rdfOrganization.getEmployeeByEmployeeId(context.request.params.employeeid as string);
            console.log(result);
            response.json({result: result});
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

export { employeeByEmployeeIdHandler}