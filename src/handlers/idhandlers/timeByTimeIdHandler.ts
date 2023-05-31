import { Response } from "express";
import { Context, Handler, Request } from "openapi-backend";
import { IOrganizationRdfQuery } from "../../rdf/IOrganizationRdfQuery";

const timeByTimeIdHandler = (rdfOrganization: IOrganizationRdfQuery) => async (context: Context, request: Request, response: Response) => {
    if (context.request.params.timeid) {
        try {
            const result = await rdfOrganization.getTimeByTimeId(context.request.params.timeid as string);
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

export { timeByTimeIdHandler}