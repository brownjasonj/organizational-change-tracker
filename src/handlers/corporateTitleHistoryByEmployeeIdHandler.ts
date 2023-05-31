import { Response } from "express"
import { Context, Request } from "openapi-backend"
import { IOrganizationRdfQuery } from "../rdf/IOrganizationRdfQuery";
import { RdfGraphFactory } from "../rdf/RdfGraphFactory";



const corporateTitleHistoryByEmployeeIdHandler = (rdfOrganization: IOrganizationRdfQuery) => async (context: Context, request: Request, response: Response) => {
    if (context.request.params.employeeid) {
//        const rdfOrganization: IOrganizationRdfQuery = RdfGraphFactory.getInstance().getOrganizationRdfGraph();
        try {
            const result = await rdfOrganization.getEmployeeCorporateTitleHistoryByEmployeeId(context.request.params.employeeid as string);
            response.json(result);
        }
        catch (error) {
            response.status(500).json(error);
        }

    }
    else {
        response.status(404);
    }
}

export { corporateTitleHistoryByEmployeeIdHandler }