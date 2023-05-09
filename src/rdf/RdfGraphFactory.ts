import { IOrganizationRdfQuery } from './IOrganizationRdfQuery';
import { BlazeGraphRdfQuery } from './BlazeGraphRdfQuery';
import { ConfigurationManager } from '../ConfigurationManager';
import { Logger } from 'pino';
import { createSparqlQueryLogger } from '../logging/createSparqlQueryLogger';
import { GraphPersistenceFactory } from '../persistence/GraphPersistenceFactory';
import { IRdfGraphDB } from '../persistence/IRdfGraphDB';

class RdfGraphFactory {
    private static singleton: RdfGraphFactory;
    private organizationRdfGraph: IOrganizationRdfQuery;

    private constructor(organizationRdfQuery: IOrganizationRdfQuery) {
        this.organizationRdfGraph = organizationRdfQuery;
    }

    static getInstance(): RdfGraphFactory {
        if (RdfGraphFactory.singleton == null) {
            const rdfGraphDB: IRdfGraphDB = GraphPersistenceFactory.getInstance().getGraphDB();
            const logger: Logger = createSparqlQueryLogger(ConfigurationManager.getInstance().getApplicationConfiguration().getLoggingConfiguration());
            RdfGraphFactory.singleton = new RdfGraphFactory(new BlazeGraphRdfQuery(rdfGraphDB, logger));
        }
        return RdfGraphFactory.singleton;
    }

    getOrganizationRdfGraph(): IOrganizationRdfQuery {
        return this.organizationRdfGraph;
    }
}

export { RdfGraphFactory }