import { IOrganizationRdfQuery } from './IOrganizationRdfQuery';
import { BlazeGraphRdfQuery } from './BlazeGraphRdfQuery';

class RdfGraphFactory {
    static organizationRdfGraph: IOrganizationRdfQuery;

    static {
        this.organizationRdfGraph = new BlazeGraphRdfQuery();
    }

    static getOrganizationRdfGraph(): IOrganizationRdfQuery {
        return this.organizationRdfGraph;
    }
}

export { RdfGraphFactory }