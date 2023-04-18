import { Response } from "express"
import { Context, Request } from "openapi-backend"
import { IOrganizationRdfQuery } from "../rdf/IOrganizationRdfQuery";
import { RdfGraphFactory } from "../rdf/RdfGraphFactory";


const employeeJoinersByDepartment = async (context: Context, request: Request, response: Response) => {
    if (context.request.query.startDate
        && context.request.query.endDate
        && context.request.query.departmentCode) {
        const rdfOrganization: IOrganizationRdfQuery = RdfGraphFactory.getInstance().getOrganizationRdfGraph();
        try {
            const result = await rdfOrganization.getDepartmentJoiners(context.request.query.departmentCode as string,
                new Date(context.request.query.startDate as string),
                new Date(context.request.query.endDate as string));
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

export { employeeJoinersByDepartment }