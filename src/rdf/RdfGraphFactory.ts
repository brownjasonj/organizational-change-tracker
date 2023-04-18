import { IOrganizationRdfQuery } from './IOrganizationRdfQuery';
import { BlazeGraphRdfQuery } from './BlazeGraphRdfQuery';

class RdfGraphFactory {
    private static singleton: RdfGraphFactory;
    private organizationRdfGraph: IOrganizationRdfQuery;

    private constructor(organizationRdfQuery: IOrganizationRdfQuery) {
        this.organizationRdfGraph = organizationRdfQuery;
    }

    static getInstance(): RdfGraphFactory {
        if (RdfGraphFactory.singleton == null) {
            RdfGraphFactory.singleton = new RdfGraphFactory(new BlazeGraphRdfQuery());
        }
        return RdfGraphFactory.singleton;
    }

    getOrganizationRdfGraph(): IOrganizationRdfQuery {
        return this.organizationRdfGraph;
    }
}

export { RdfGraphFactory }