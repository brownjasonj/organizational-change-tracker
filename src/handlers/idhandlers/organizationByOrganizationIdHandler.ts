import { Response } from "express";
import { Context, Handler, Request } from "openapi-backend";
import { IOrganizationRdfQuery } from "../../rdf/IOrganizationRdfQuery";

const organizationByOrganizationIdHandler = (rdfOrganization: IOrganizationRdfQuery) => async (context: Context, request: Request, response: Response) => {
    if (context.request.params.organizationid) {
        try {
            const result = await rdfOrganization.getOrganizationByOrganizationId(context.request.params.organizationid as string);
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

export { organizationByOrganizationIdHandler}