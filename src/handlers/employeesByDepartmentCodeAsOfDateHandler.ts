import { Response } from "express"
import { Context, Request } from "openapi-backend"
import { IOrganizationRdfQuery } from "../rdf/IOrganizationRdfQuery";
import { RdfGraphFactory } from "../rdf/RdfGraphFactory";

const employeesByDepartmentCodeAsOfDateHandler = async (context: Context, request: Request, response: Response) => {
    const rdfOrganization: IOrganizationRdfQuery = RdfGraphFactory.getInstance().getOrganizationRdfGraph();
    try {
        if (context.request.params.departmentcode
            && context.request.params.asofdate) {
            const result = await rdfOrganization.getEmployeesByDepartmentCodeAsOfDate(context.request.params.departmentcode as string, new Date(context.request.params.asofdate as string));
            console.log(result);
            response.json(result);
        }
    }
    catch (error) {
        console.log(error);
        response.status(500).json(error);
    }
}

export { employeesByDepartmentCodeAsOfDateHandler }