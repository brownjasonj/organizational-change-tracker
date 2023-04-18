import { Response } from "express"
import { Context, Request } from "openapi-backend"
import { IOrganizationRdfQuery } from "../rdf/IOrganizationRdfQuery";
import { RdfGraphFactory } from "../rdf/RdfGraphFactory";


const operationsDeleteTriplesHandler = async (context: Context, request: Request, response: Response) => {
    const rdfOrganization: IOrganizationRdfQuery = RdfGraphFactory.getInstance().getOrganizationRdfGraph();
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