import { Response } from "express";
import { Context, Handler, Request } from "openapi-backend";
import { IOrganizationRdfQuery } from "../../rdf/IOrganizationRdfQuery";
import { classToPlain } from "class-transformer";

const membershipByMembershipIdHandler = (rdfOrganization: IOrganizationRdfQuery) => async (context: Context, request: Request, response: Response) => {
    if (context.request.params.membershipid) {
        try {
            const result = await rdfOrganization.getMembershipByMembershipId(context.request.params.membershipid as string);
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

export { membershipByMembershipIdHandler}