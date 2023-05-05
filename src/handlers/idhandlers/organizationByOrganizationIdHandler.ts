import { Response } from "express";
import { Context, Handler, Request } from "openapi-backend";
import { IOrganizationRdfQuery } from "../../rdf/IOrganizationRdfQuery";
import { RdfGraphFactory } from "../../rdf/RdfGraphFactory";

const organizationByOrganizationIdHandler = async (context: Context, request: Request, response: Response) => {
    if (context.request.params.organizationId) {
        const rdfOrganization: IOrganizationRdfQuery = RdfGraphFactory.getInstance().getOrganizationRdfGraph();
        try {
            const result = await rdfOrganization.getOrganizationByOrganizationId(context.request.params.organizationId as string);
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