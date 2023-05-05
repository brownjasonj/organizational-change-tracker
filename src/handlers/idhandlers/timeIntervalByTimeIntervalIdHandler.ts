import { Response } from "express";
import { Context, Handler, Request } from "openapi-backend";
import { IOrganizationRdfQuery } from "../../rdf/IOrganizationRdfQuery";
import { RdfGraphFactory } from "../../rdf/RdfGraphFactory";
import { classToPlain } from "class-transformer";

const timeIntervalByTimeIntervalIdHandler = async (context: Context, request: Request, response: Response) => {
    if (context.request.params.timeIntervalId) {
        const rdfOrganization: IOrganizationRdfQuery = RdfGraphFactory.getInstance().getOrganizationRdfGraph();
        try {
            const result = await rdfOrganization.getTimeIntervalByTimeIntervalId(context.request.params.timeIntervalId as string);
            console.log(result);
            response.json(classToPlain(result));
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

export { timeIntervalByTimeIntervalIdHandler}