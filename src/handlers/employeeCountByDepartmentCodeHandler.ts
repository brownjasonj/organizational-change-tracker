import { Response } from "express";
import { Context, Request } from "openapi-backend";
import { IOrganizationRdfQuery } from "../rdf/IOrganizationRdfQuery";
import { RdfGraphFactory } from "../rdf/RdfGraphFactory";



const employeeCountByDepartmentCodeHandler = async (context: Context, request: Request, response: Response) => {
    if (context.request.query.departmentCode
        && context.request.query.asOf) {
        const rdfOrganization: IOrganizationRdfQuery = RdfGraphFactory.getInstance().getOrganizationRdfGraph();
        try {
            const result = await rdfOrganization.getEmployeeCountByDepartmentAsOf(context.request.query.departmentCode as string, new Date(context.request.query.asOf as string));
            response.json(result);
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