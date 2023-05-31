import { Response } from "express"
import { Context, Request } from "openapi-backend"
import { IOrganizationRdfQuery } from "../rdf/IOrganizationRdfQuery";

const operationsDeleteTriplesHandler = (rdfOrganization: IOrganizationRdfQuery) => async (context: Context, request: Request, response: Response) => {
    try {
        const result = await rdfOrganization.deleteAllTriple();
        response.json({result: result});
    }
    catch (err) {
        console.log(err);
        response.status(500).json(err);
        return;
    }
}

export { operationsDeleteTriplesHandler }