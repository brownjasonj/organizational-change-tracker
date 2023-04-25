import { IOrganizationRdfQuery } from './IOrganizationRdfQuery';
import { BlazeGraphRdfQuery } from './BlazeGraphRdfQuery';
import { ConfigurationManager } from '../ConfigurationManager';
import { Logger } from 'pino';
import { createSparqlQueryLogger } from '../logging/createSparqlQueryLogger';

class RdfGraphFactory {
    private static singleton: RdfGraphFactory;
    private organizationRdfGraph: IOrganizationRdfQuery;

    private constructor(organizationRdfQuery: IOrganizationRdfQuery) {
        this.organizationRdfGraph = organizationRdfQuery;
    }

    static getInstance(): RdfGraphFactory {
        if (RdfGraphFactory.singleton == null) {
            const logger: Logger = createSparqlQueryLogger(ConfigurationManager.getInstance().getApplicationConfiguration().getLoggingConfiguration());
            RdfGraphFactory.singleton = new RdfGraphFactory(new BlazeGraphRdfQuery(logger));
        }
        return RdfGraphFactory.singleton;
    }

    getOrganizationRdfGraph(): IOrganizationRdfQuery {
        return this.organizationRdfGraph;
    }
}

export { RdfGraphFactory }