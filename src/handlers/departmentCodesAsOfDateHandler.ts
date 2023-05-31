import { Response } from "express";
import { Context, Request } from "openapi-backend";
import { IOrganizationRdfQuery } from "../rdf/IOrganizationRdfQuery";

const departmentCodesAsOfDateHandler =  (rdfOrganization: IOrganizationRdfQuery) => async (context: Context, request: Request, response: Response) => {
    if (context.request.params.asofdate) {
        try {
            const result = await rdfOrganization.getDepartmentCodesAsOfDate(new Date(context.request.params.asofdate as string));
            response.json(result);
        }
        catch (error) {
            response.status(500).json(error);
        }
    }
    else {
        response.status(404).json({ message: "Missing AsOfDate" });
    }
}

export { departmentCodesAsOfDateHandler} 