import { Response } from "express";
import { Context, Request } from "openapi-backend";
import { IOrganizationRdfQuery } from "../rdf/IOrganizationRdfQuery";
import { RdfGraphFactory } from "../rdf/RdfGraphFactory";



const employeeCountByDepartmentCodeAsOfDateHandler =  (rdfOrganization: IOrganizationRdfQuery) => async (context: Context, request: Request, response: Response) => {
    if (context.request.params.departmentcode
        && context.request.params.asofdate) {
//        const rdfOrganization: IOrganizationRdfQuery = RdfGraphFactory.getInstance().getOrganizationRdfGraph();
        try {
            const result = await rdfOrganization.getEmployeeCountByDepartmentAsOf(context.request.params.departmentcode as string, new Date(context.request.params.asofdate as string));
            response.json(result);
            return;
        }
        catch (err) {
            response.status(500).json({err});
            return;
        }
    }
    else {
        response.status(400).json({error: 'Missing required parameters'});
    }
}



export { employeeCountByDepartmentCodeAsOfDateHandler };