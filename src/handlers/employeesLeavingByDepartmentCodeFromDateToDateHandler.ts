import { Response } from "express"
import { Context, Request } from "openapi-backend"
import { IOrganizationRdfQuery } from "../rdf/IOrganizationRdfQuery";
import { RdfGraphFactory } from "../rdf/RdfGraphFactory";
import { Calendar } from "../utils/Calendar";

const employeesLeavingByDepartmentCodeFromDateToDateHandler =  (rdfOrganization: IOrganizationRdfQuery) => async (context: Context, request: Request, response: Response) => {
    if (context.request.params.departmentcode
        && context.request.params.fromdate
        && context.request.params.todate) {
//        const rdfOrganization: IOrganizationRdfQuery = RdfGraphFactory.getInstance().getOrganizationRdfGraph();
        try {
            const result = await rdfOrganization.getDepartmentLeavers(context.request.query.departmentcode as string,
                Calendar.getStartOfDay(new Date(context.request.params.fromdate as string)),
                Calendar.getEndOfDay(new Date(context.request.params.todate as string)));
                response.json({result: result});
                return;
        }
        catch (err) {
            console.log(err);
            response.status(500).json(err);
            return;
        }
    }
    else {
        response.json({ message: "done" });
    }
}

export { employeesLeavingByDepartmentCodeFromDateToDateHandler }